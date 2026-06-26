const path = require("path");

const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(201).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
};

module.exports = { uploadImage };
