// server/routes/runScript.js
const express = require('express');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { io } = require("socket.io-client");

const socket = io("http://172.29.2.207:5000");
let bobProcess = null;
let aliceProcess = null;

// Route to run the taggen script
router.post('/run-taggen', (req, res) => {
  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ success: false, message: 'No filename provided' });
  }

  const scriptPath = '/home/saniya/Downloads/Demo/Admin-Cloud/SetupTagGen.sh';
  const filePath = `/home/saniya/Downloads/Demo/Storage/${filename}`;
  const fullCommand = `bash "${scriptPath}" "${filePath}"`;

  exec(fullCommand, { cwd: '/home/saniya/Downloads/Demo/Admin-Cloud' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).json({ success: false, message: stderr || error.message });
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    res.json({ success: true, output: stdout });
  });
});

// Route to send file to another machine using SCP
router.post('/send-file', (req, res) => {
  console.log("Received in /send-file:", req.body); // 🛠 ADD THIS LINE
  const { fileName, ipAddress, username, password } = req.body;
  if (!fileName || !ipAddress || !username || !password) {
    return res.status(400).json({ success: false, message: 'Missing input: filename, ipAddress, username or password' });
  }

  const localFilePath = `/home/saniya/Downloads/Demo/Storage/${fileName}`;
  const remotePath = `/home/saniya/Downloads/Demo/Storage`;
  
  // Constructing SCP command with manual password entry
  const scpCommand = `sshpass -p ${password} scp "${localFilePath}" ${username}@${ipAddress}:${remotePath}`;

  exec(scpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`SCP Error: ${stderr}`);
      return res.status(500).json({ success: false, message: stderr || error.message });
    }

    console.log(`SCP Output: ${stdout}`);
    res.json({ success: true, output: stdout });
  });
});

// Route to send Params.bin and metaData.bin to Auditor
router.post('/send-to-auditor', (req, res) => {
  const { ipAddress, username, password } = req.body;
  if (!ipAddress || !username || !password) {
    return res.status(400).json({ success: false, message: 'Missing input fields' });
  }

  const filesToSend = ['Params.bin', 'metaData.bin'];
  const localBase = '/home/saniya/Downloads/Demo/Admin-Cloud';
  const remoteBase = `/home/${username}/Downloads/Demo/Auditor`;

  // Construct two SCP commands
  const commands = filesToSend.map(file => {
    const source = `${localBase}/${file}`;
    return `sshpass -p ${password} scp "${source}" ${username}@${ipAddress}:${remoteBase}`;
  });

  // Run both commands in sequence
  const fullCommand = commands.join(' && '); // run second only if first succeeds

  exec(fullCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('SCP Error:', stderr || error.message);
      return res.status(500).json({ success: false, message: stderr || error.message });
    }

    console.log('SCP Output:', stdout);
    res.json({ success: true, output: stdout });
  });
});

// Route to send Params.bin to Auditee
router.post('/send-to-auditee', (req, res) => {
  const { ipAddress, username, password } = req.body;
  if (!ipAddress || !username || !password) {
    return res.status(400).json({ success: false, message: 'Missing input fields' });
  }

  const filesToSend = ['Params.bin'];
  const localBase = '/home/saniya/Downloads/Demo/Admin-Cloud';
  const remoteBase = `/home/${username}/Downloads/Demo/Storage/`;

  // Construct two SCP commands
  const commands = filesToSend.map(file => {
    const source = `${localBase}/${file}`;
    return `sshpass -p ${password} scp "${source}" ${username}@${ipAddress}:${remoteBase}`;
  });

  // Run both commands in sequence
  const fullCommand = commands.join(' && '); // run second only if first succeeds

  exec(fullCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('SCP Error:', stderr || error.message);
      return res.status(500).json({ success: false, message: stderr || error.message });
    }

    console.log('SCP Output:', stdout);
    res.json({ success: true, output: stdout });
  });
  
});



// === Modified /run-bob (with persistent Bob process) ===
router.post('/run-bob', (req, res) => {
  try {
    console.log("API request received: /run-bob");
    const scriptPath = '/home/saniya/Downloads/Demo/Storage/Bob.sh';
    const io = req.app.get('socketio');

    if (bobProcess) {
      return res.status(400).json({ success: false, message: 'Bob is already running.' });
    }

    if (!fs.existsSync(scriptPath)) {
      return res.status(404).json({ success: false, error: "Script not found" });
    }
    
    bobProcess = spawn('bash', [scriptPath], {
      cwd: '/home/saniya/Downloads/Demo',
    });

    bobProcess.stdout.setEncoding('utf8');
    bobProcess.stderr.setEncoding('utf8');

    bobProcess.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      console.log(`Bob Output: ${msg}`);
      io.emit('bob-output', msg);
    });

    bobProcess.stderr.on('data', (data) => {
      const msg = data.toString().trim();
      console.error(`Bob Error: ${msg}`);
      io.emit('bob-error', msg);
    });

    bobProcess.on('error', (err) => {
      console.error('Bob spawn error:', err);
    });

    bobProcess.on('close', (code) => {
      console.log(`Bob.sh exited with code ${code}`);
      bobProcess = null;
    });

    res.json({ success: true, message: 'Bob started successfully' });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ success: false, error: `Server error: ${err.message}` });
  }
});

// === Stop Bob ===
router.post('/stop-bob', (req, res) => {
  if (!bobProcess) {
    return res.status(400).json({ success: false, message: 'Bob is not running.' });
  }

  bobProcess.kill('SIGINT');
  bobProcess = null;
  res.json({ success: true, message: 'Bob stopped successfully' });
});

// === Modified /run-alice (with persistent Alice process) ===
router.post('/run-alice', (req, res) => {
  try {
    console.log("API request received: /run-alice");
    const scriptPath = '/home/saniya/Downloads/Demo/Auditor/Alice.sh';
    const io = req.app.get('socketio');

    if (aliceProcess) {
      return res.status(400).json({ success: false, message: 'Alice is already running.' });
    }

    if (!fs.existsSync(scriptPath)) {
      return res.status(404).json({ success: false, error: "Script not found" });
    }
    
    aliceProcess = spawn('bash', [scriptPath], {
      cwd: '/home/saniya/Downloads/Demo',
    });

    aliceProcess.stdout.setEncoding('utf8');
    aliceProcess.stderr.setEncoding('utf8');

    aliceProcess.stdout.on('data', (data) => {
      const msg = data.toString().trim();
      console.log(`Alice Output: ${msg}`);
      socket.emit('alice-output', { message: msg }); 
    });
    
    aliceProcess.stderr.on('data', (data) => {
      const msg = data.toString().trim();
      console.error(`Alice Error: ${msg}`);
     socket.emit('alice-output', { message: `Error: ${msg}` });  
    });

    aliceProcess.on('error', (err) => {
      console.error('Alice spawn error:', err);
    });

    aliceProcess.on('close', (code) => {
      console.log(`Alice.sh exited with code ${code}`);
      aliceProcess = null;
    });

    res.json({ success: true, message: 'Alice started successfully' });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ success: false, error: `Server error: ${err.message}` });
  }
});

// === Stop Alice ===
router.post('/stop-alice', (req, res) => {
  if (!aliceProcess) {
    return res.status(400).json({ success: false, message: 'Alice is not running.' });
  }

  aliceProcess.kill('SIGINT');
  aliceProcess = null;
  res.json({ success: true, message: 'Alice stopped successfully' });
});
// Export Router
module.exports = router;