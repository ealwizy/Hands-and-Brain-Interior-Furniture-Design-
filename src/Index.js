// index.js - simple delete server for Cloudinary
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const app = express();
app.use(cors());
app.use(express.json());

// configure cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// simple header secret to protect the endpoint
const SERVER_SECRET = process.env.SERVER_SECRET || '';

app.post('/api/delete', async (req, res) => {
  try {
    // basic auth check (expects header: x-server-secret: YOUR_SECRET)
    const headerSecret = req.headers['x-server-secret'] || '';
    if (!SERVER_SECRET || headerSecret !== SERVER_SECRET) {
      return res.status(401).json({ ok: false, error: 'unauthorized' });
    }

    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ ok: false, error: 'publicId required' });

    // call cloudinary to destroy by public_id
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    return res.json({ ok: true, result });
  } catch (err) {
    console.error('delete error', err);
    return res.status(500).json({ ok: false, error: 'delete_failed', details: err.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
