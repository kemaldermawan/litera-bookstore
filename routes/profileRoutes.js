const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isLoggedIn } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration untuk profile picture
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = 'public/img/profiles/';
        try {
            fs.mkdirSync(dest, { recursive: true });
        } catch (err) {
            return cb(err);
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + req.session.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar (JPG, PNG, GIF)'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB max
});

router.get('/', isLoggedIn, profileController.getProfile);
router.post('/update-address', isLoggedIn, profileController.updateAddress);
router.post('/delete-account', isLoggedIn, profileController.deleteAccount);
router.get('/edit', isLoggedIn, profileController.getEditProfile);
// Multer wrapper to handle errors and render edit page on failure
const uploadProfileMiddleware = (req, res, next) => {
    upload.single('profilePicture')(req, res, function(err) {
        if (err) {
            // Multer error (file too large, invalid mime, etc.)
            const errorMessage = err.code === 'LIMIT_FILE_SIZE' ? 'Ukuran gambar terlalu besar (Max 2MB)' : (err.message || 'Gagal upload file');
            // Fetch fresh user data and render edit page with error
            const User = require('../models/User');
            return User.findById(req.session.user.id).lean()
                .then(user => res.render('pages/edit-profile', { user: user, error: errorMessage }))
                .catch(() => res.render('pages/edit-profile', { user: req.session.user, error: errorMessage }));
        }
        next();
    });
};

router.post('/edit', isLoggedIn, uploadProfileMiddleware, profileController.postEditProfile);

module.exports = router;
