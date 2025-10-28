// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Admin login route
app.post("/admin/login", (req, res) => {
  const { code } = req.body;
  if (code === "081386") {
    return res.json({ success: true, message: "Admin access granted" });
  }
  return res.status(401).json({ success: false, message: "Invalid code" });
});

// Upload route
app.post("/upload", async (req, res) => {
  try {
    const file = req.files.image;
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "hands_brain_uploads",
    });
    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hands & Brain Furniture Server Running ✅");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
