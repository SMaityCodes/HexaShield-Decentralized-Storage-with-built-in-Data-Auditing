const express = require('express');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

let filesCollection;

const connectToMongo = async () => {
  try {
    const client = await MongoClient.connect(process.env.MONGO_URI);
    const db = client.db("hexashield");
    filesCollection = db.collection("files");
    console.log("MongoDB connected in upload.js");
    return filesCollection;
  } catch (err) {
    console.error("MongoDB connection error in upload.js:", err);
    throw err;
  }
};

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!filesCollection) {
      return res.status(500).send("Database connection not established");
    }
    
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    const fileRecord = {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
      data: file.buffer
    };

    const result = await filesCollection.insertOne(fileRecord);
    res.status(200).json({ 
      message: "File uploaded successfully", 
      fileId: result.insertedId,
      fileName: file.originalname
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).send("Server error");
  }
});

router.get('/files', async (req, res) => {
  try {
    if (!filesCollection) {
      return res.status(500).send("Database connection not established");
    }
    
    const files = await filesCollection.find({}, { projection: { data: 0 } }).sort({ uploadedAt: -1 }).toArray();
    res.status(200).json(files);
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).send("Failed to fetch uploaded files");
  }
});

router.get('/files/:id', async (req, res) => {
  try {
    if (!filesCollection) {
      return res.status(500).send("Database connection not established");
    }
    
    const fileId = req.params.id;
    const file = await filesCollection.findOne({ _id: new ObjectId(fileId) });
    
    if (!file) {
      return res.status(404).send("File not found");
    }
    
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
    
    res.send(file.data.buffer);
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).send("Server error");
  }
});

router.delete('/files/:id', async (req, res) => {
  try {
    if (!filesCollection) {
      return res.status(500).send("Database connection not established");
    }
    
    const fileId = req.params.id;
    const result = await filesCollection.deleteOne({ _id: new ObjectId(fileId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).send("File not found");
    }
    
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res.status(500).send("Server error");
  }
});

module.exports = { router, connectToMongo, getFilesCollection: () => filesCollection };