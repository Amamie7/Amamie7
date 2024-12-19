// Middlewares\filehandler.js

// npm install multer

import multer from 'multer'; // Importing the Multer library for handling file uploads

// Configuring the storage settings for uploaded files
const storage = multer.diskStorage({
    // Setting the destination for the uploaded files
    destination: (req, file, cb) => {
        // Use the file path provided in the request headers (set by SetUploadsfilePathHandler middleware)
        // cb(null, targetFilepath); 
        cb(null, req.headers.targetFilepath); 
    },
    // Setting the filename for the uploaded files
    filename: (req, file, cb) => {
        // Creating a unique filename by appending the current timestamp to the original file name
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

// File filter to determine which files are allowed to be uploaded
const filefilter = (req, file, cb) => {
    // Array of allowed MIME types
    const allowedTypes = [
        'image/png', 'image/jpg', 'image/jpeg', 
        'video/mp4', 'video/mpeg', 'video/quicktime',
        'audio/mp3', 'audio/wav',
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    // Check if the file's MIME type is in the list of allowed types
    cb(null, allowedTypes.includes(file.mimetype));
};

// Creating an upload instance with the specified storage configuration and file filter
const upload = multer({ storage: storage, fileFilter: filefilter });

// Exporting the upload instance to be used in other parts of the application
export default upload;

