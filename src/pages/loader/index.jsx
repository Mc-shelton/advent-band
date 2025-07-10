import React, { useState } from "react";

function Uploader() {
  const [base64Image, setBase64Image] = useState("");
  const [filename, setFilename] = useState("");
  const [previewSrc, setPreviewSrc] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result);
      setPreviewSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!base64Image) {
      setMessage("❌ Please select an image.");
      return;
    }

    const finalFilename = filename.trim() || "profile.png";

    try {
      const response = await fetch("https://web-pi-two-28.vercel.app/api/loader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Image,
          filename: finalFilename,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("✅ Upload successful!");
      } else {
        setMessage("❌ Upload failed: " + result.message);
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", fontFamily: "Arial" }}>
      <h3>Upload Profile Image</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Enter filename (e.g. avatar.jpg)"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        style={{ marginTop: "10px", width: "100%", padding: "8px" }}
      />
      <button
        onClick={handleUpload}
        style={{ marginTop: "10px", padding: "10px 15px" }}
      >
        Upload
      </button>
      {previewSrc && (
        <img
          src={previewSrc}
          alt="Preview"
          style={{ marginTop: "20px", maxWidth: "100%" }}
        />
      )}
      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}

export default Uploader;
