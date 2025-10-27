import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CONFIG } from "./config";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [priceTag, setPriceTag] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [uploading, setUploading] = useState(false);

  // Splash screen with music
  useEffect(() => {
    const audio = new Audio("/assets/splash-audio.mp3");
    audio.play().catch(() => {});
    const timer = setTimeout(() => setShowSplash(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Upload image to Cloudinary
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setImages([
        ...images,
        { url: res.data.secure_url, price: priceTag || "₦0" },
      ]);
      setPriceTag("");
    } catch (err) {
      alert("Upload failed. Please check your connection or Cloudinary setup.");
    } finally {
      setUploading(false);
    }
  };

  // Admin check
  const checkAdmin = () => {
    if (adminInput === CONFIG.ADMIN_CODE) {
      setIsAdmin(true);
      alert("Admin access granted");
    } else {
      alert("Invalid code");
    }
  };

  // Splash screen
  if (showSplash)
    return (
      <div
        style={{
          backgroundColor: "black",
          color: "gold",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.img
          src="/assets/logo.png"
          alt="Hands & Brain Logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          style={{ width: "180px", height: "180px" }}
        />
        <h2 style={{ marginTop: "20px" }}>Hands & Brain</h2>
        <p>Interior Furniture Design</p>
      </div>
    );

  // Main UI
  return (
    <div
      style={{
        background: "black",
        minHeight: "100vh",
        color: "gold",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1>🪑 Hands & Brain Interior Furniture Design</h1>
      {!isAdmin ? (
        <div style={{ marginTop: "20px" }}>
          <h3>Enter Admin Code</h3>
          <input
            type="password"
            placeholder="Enter code..."
            value={adminInput}
            onChange={(e) => setAdminInput(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid gold",
              color: "black",
            }}
          />
          <button
            onClick={checkAdmin}
            style={{
              marginLeft: "10px",
              padding: "8px 12px",
              background: "gold",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          <h3>Upload Product Image</h3>
          <input
            type="file"
            onChange={handleUpload}
            accept="image/*"
            style={{ marginBottom: "10px" }}
          />
          <input
            type="text"
            placeholder="Enter price (₦)"
            value={priceTag}
            onChange={(e) => setPriceTag(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid gold",
              color: "black",
              marginLeft: "10px",
            }}
          />
          {uploading && <p>Uploading...</p>}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(img)}
            style={{
              border: "1px solid gold",
              borderRadius: "10px",
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <img
              src={img.url}
              alt="Furniture"
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <p style={{ background: "#111", margin: 0, padding: "5px" }}>
              💰 {img.price}
            </p>
          </motion.div>
        ))}
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={selectedImage.url}
            alt="Preview"
            style={{
              width: "90%",
              maxWidth: "400px",
              border: "3px solid gold",
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </div>
  );
}
