const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Routes
const authRoutes = require('./routes/authRoutes');
const { router: uploadRoute, connectToMongo, getFilesCollection } = require('./routes/upload');
const localStorageRoutes = require('./routes/localStorage');
const runScriptRoute = require('./routes/runScript');
const userRoutes = require('./routes/userRoutes');
app.use('/api/auth', authRoutes);
app.use("/api", uploadRoute);
app.use('/api/local-storage', localStorageRoutes);
app.use('/api/script', runScriptRoute);
app.use('/api/users', userRoutes);

// --- Create server and socket.io ---
const server = createServer(app); // ✅ create HTTP server
const io = new Server(server, {   // ✅ attach socket.io
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('socketio', io); // store io globally

// --- Role mapping ---
const roles = {}; // role => [socketId, socketId, ...] mapping

// --- Handle socket connections ---
io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  // Register role
  socket.on('register-role', (data) => {
    console.log('Registered role:', data.role);
    if (!roles[data.role]) {
      roles[data.role] = [];
    }
    if (!roles[data.role].includes(socket.id)) {
      roles[data.role].push(socket.id);
    }
  });
  
  socket.on('alice-output', (data) => {
    console.log('From Alice:', data.message);     // ✅ Logs to Cloud backend terminal
    io.emit('alice-output', { message: data.message }); // ✅ Sends to frontend clients
  });
  

  // Handle start-verification
  socket.on('start-verification', (data) => {
    if (!data || !data.target || !data.message) {
      console.log('Invalid start-verification data:', data);
      return;
    }

    const targetRole = data.target;
    const message = data.message;

    if (roles[targetRole]) {
      roles[targetRole].forEach(socketId => {
        io.to(socketId).emit('start-verification', { message });
      });
      console.log(`Forwarded start-verification message to role: ${targetRole}`);
    } else {
      console.log(`No connected sockets for role: ${targetRole}`);
    }
  });

  // Handle ready-for-challenge
  socket.on('ready-for-challenge', (data) => {
    if (!data || !data.message) {
      console.log('Invalid data received for ready-for-challenge:', data);
      return;
    }
    console.log('Received ready-for-challenge:', data.message);
    socket.broadcast.emit('ready-for-challenge', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (const role in roles) {
      roles[role] = roles[role].filter(id => id !== socket.id);
      if (roles[role].length === 0) {
        delete roles[role];
      }
    }
  });
});

// --- API for triggering verification
app.post('/api/start-verification', (req, res) => {
  console.log('Trigger: Start Verification');

  if (roles['Alice']) {
    console.log('Sending to Alice sockets:', roles['Alice']);
    roles['Alice'].forEach(socketId => {
      io.to(socketId).emit('start-verification', { message: 'Hi Alice!' });
    });
  } else {
    console.log('No Alice connected');
  }

  if (roles['Bob']) {
    console.log('Sending to Bob sockets:', roles['Bob']);
    roles['Bob'].forEach(socketId => {
      io.to(socketId).emit('start-verification', { message: 'Hi Bob!' });
    });
  } else {
    console.log('No Bob connected');
  }

  res.json({ success: true });
});

// --- MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected via mongoose');

  // Initialize file collection
  await connectToMongo();
  console.log('File collection initialized');

  // Define /api/files route
  app.get("/api/files", async (req, res) => {
    try {
      const filesCollection = getFilesCollection();
      if (!filesCollection) {
        return res.status(500).send("Database connection not established");
      }
      
      const files = await filesCollection.find({}, { projection: { data: 0 } }).sort({ uploadedAt: -1 }).toArray();
      res.json(files);
    } catch (err) {
      console.error("Error fetching files:", err);
      res.status(500).send("Server error");
    }
  });

  // Start server
  const PORT = 5000;
  server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('MongoDB connection error:', err));