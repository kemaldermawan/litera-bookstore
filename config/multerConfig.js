const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/covers');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|webp/;

    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = allowedFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Hanya file gambar (jpeg, jpg, png, gif, webp) yang diizinkan!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        // fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

module.exports = upload.single('coverImage');