"use strict";

const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirUpload = "src/assets/upload/";
    if (!fs.existsSync(dirUpload)) {
      fs.mkdirSync(dirUpload, { recursive: true });
    }
    cb(null, dirUpload);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".");
    const newExt = ext[ext.length - 1];
    cb(null, `${Date.now()}.${newExt}`);
  },
});

const upload = multer({ storage: storage });

const unlink = (filename, path = "") => {
  const pathImageRemove = !path ? "src\\assets\\upload\\" + filename : filename;

  if (!fs.existsSync(pathImageRemove)) {
    return;
  }

  fs.unlinkSync(pathImageRemove);
};

const mapperImage = (image) => `http://localhost:${process.env.PORT}/${image}`;

const mapperImageToFilename = (image) => {
  console.log(image);

  const array = String(image).split("/");

  console.log(array);

  return array[array.length - 1];
};

module.exports = {
  upload,
  unlink,
  mapperImage,
  mapperImageToFilename,
};
