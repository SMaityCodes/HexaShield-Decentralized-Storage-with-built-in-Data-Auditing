const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { register, login } = require('../controllers/authController');
const File = require('../models/fileModel');
const User = require('../models/User'); // ✅ Add this line
const authenticate = require('../middleware/authenticate');
const LocalStorage = require('../models/LocalStorage');
// ✅ Your JWT secret (make sure it's the same used in login/register)
const SECRET = process.env.JWT_SECRET || 'your-default-secret'; // fallback if .env is missing

router.post('/register', register);
router.post('/login', login);

// Save uploaded file metadata
router.post('/upload', async (req, res) => {
  try {
    const fileData = req.body;
    await File.create(fileData);
    res.status(200).json({ message: 'File saved to database' });
  } catch (error) {
    console.error("Upload Error:", error); // Log the error for better debugging
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// ✅ GET user profile from token
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log('Decoded Token:', decoded);
    const user = await User.findById(decoded.id).select('-password');
    console.log('Fetched User:', user); // Log the fetched user data for debugging

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user); // returns email, hostname, ipAddress, role, etc.
  } catch (err) {
    console.error("JWT verify error:", err); // Log JWT verification errors for debugging
    res.status(403).json({ message: 'Invalid token' });
  }
});

router.get('/local-storages', async (req, res) => {
  try {
    const storages = await LocalStorage.find();
    res.status(200).json(storages);
  } catch (error) {
    console.error('Error fetching local storages:', error);
    res.status(500).json({ error: 'Failed to fetch local storages' });
  }
});
module.exports = router;
