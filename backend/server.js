const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, "../upload_images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); 
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, 
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("images", 10); 

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb("Error: Images Only!");
}
const cors = require("cors");
app.use(cors()); 

app.get("/", (req, res) => {
  res.send("Backend server is running. Use /upload endpoint to upload images.");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ msg: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ msg: err });
    }
    if (req.files && req.files.length > 0) {
      const filepaths = req.files.map(
        (file) => `/upload_images/${file.filename}`
      );
      res.status(200).json({
        msg: "Files Uploaded Successfully!",
        files: filepaths,
      });
    } else {
      res.status(400).json({ msg: "No files were uploaded." });
    }
  });
});

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}. Upload directory: ${uploadDir}`)
);
