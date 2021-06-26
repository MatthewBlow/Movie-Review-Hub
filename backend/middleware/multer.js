const multer = require('multer');

// This is the middleware for checking the file type of the selected file from the user on the post
// The application will not accept any file that doesnt match the MIME_TYPE_MAP constant

// Layout for accepted file types
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// Function for checking file type using multer
const storage = multer.diskStorage({
  // Setting destination
  destination: (req, file, cb) => {
    // Verifying the mime type by checking if the 'file.mimetype' is present in the MIME_TYPE MAP
    // Store result in constant
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    // Callback for where to store images
    cb(null, "images");
  },
  // Setting the name of the image
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});
  // Export the image
 module.exports = multer({storage: storage}).single("image")
