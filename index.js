const express = require("express");
const multer = require("multer");
const path = require("path");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// Konfigurasi Multer untuk menyimpan file gambar
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname);
    if (allowedExtensions.includes(ext.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Array untuk menyimpan path gambar yang diunggah
let uploadedImages = [];

// Endpoint POST untuk mengunggah file gambar
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Menyimpan path gambar ke dalam array
  uploadedImages.push(req.file.path);

  return res.status(200).json({ message: "File uploaded successfully" });
});

// Endpoint GET untuk menampilkan halaman dengan daftar gambar yang diunggah
app.get("/", (req, res) => {
  res.render("index", { images: uploadedImages });
});

// Menyajikan file gambar yang diunggah
app.use("/uploads", express.static("uploads"));

// Mulai server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
