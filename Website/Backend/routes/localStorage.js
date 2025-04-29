const express = require('express');
const path = require('path');
const router = express.Router();

let localFiles = []; // in-memory file list

// Add a file to local storage
router.post('/add', (req, res) => {
  const { id, name, type, size, lastModified, status } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  localFiles.push({ id, name, type, size, lastModified, status });
  res.status(200).json({ message: 'File added to local storage' });
});

// Get all files from local storage
router.get('/', (req, res) => {
  res.json(localFiles);
});

// ✅ NEW: Download a file by ID
router.get('/:id/download', (req, res) => {
  const fileId = req.params.id;
  const fileMeta = localFiles.find(file => file.id === fileId);

  if (!fileMeta) {
    return res.status(404).json({ error: 'File not found' });
  }

  const filePath = path.join(__dirname, '../../local-storage', fileMeta.name); // Make sure file is saved here

  res.download(filePath, fileMeta.name, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

module.exports = router;