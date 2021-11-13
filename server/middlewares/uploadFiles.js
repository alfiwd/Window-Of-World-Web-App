// Import package
const multer = require("multer");

exports.uploadFiles = (imageFile, bookFile) => {
  // Initialization multer diskstorage
  // Make destination
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });
  const fileFilter = function (req, file, cb) {
    if (file.filename === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        req.fileValidationError = {
          message: "Only image files are allowed!",
        };
        return cb(new Error("Only image files are allowed!"), false);
      }
    }
    if (file.filename === bookFile) {
      if (!file.originalname.match(/\.(epub|EPUB|pdf|PDF)$/)) {
        req.fileValidationError = {
          message: "Only book files are allowed!",
        };
        return cb(new Error("Only book files are allowed!"), false);
      }
    }
    cb(null, true);
  };
  const sizeInMB = 30;
  const maxSize = sizeInMB * 1000 * 1000;
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: imageFile,
    },
    {
      name: bookFile,
    },
  ]);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (!req.file && !err) {
        // return res.status(400).send({
        //   message: "Plase select files to upload",
        // });
        return next();
      }
      if (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file sized 10MB!",
          });
        }
        return res.status(400).send(err);
      }
      //   If okay
      //   In the controller we can access using req.file or req.files
      return next();
    });
  };
};
