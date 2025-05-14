const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "../upload_images")),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});
const upload = multer({ storage });

router.post("/", upload.array("files"), (req, res) => {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ error: "No files uploaded." });
  }
  const uploaded = req.files.map((f) => f.filename);
  res.json({ uploaded });
});

module.exports = router;