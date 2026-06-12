const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const { isLoggedIn } = require('../middleware/auth');

const multerModuleImport = require('../config/multerConfig');

let upload;
if (multerModuleImport && typeof multerModuleImport.single === 'function') {
    upload = multerModuleImport;
} else if (multerModuleImport && multerModuleImport.upload && typeof multerModuleImport.upload.single === 'function') {
    upload = multerModuleImport.upload;
} else {
    const multer = require('multer');
    const path = require('path');
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/img/profiles')),
        filename: (req, file, cb) => cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`)
    });
    upload = multer({ storage: storage });
}

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

router.get('/logout', authController.logout);

router.get('/profile', isLoggedIn, profileController.getProfile);
router.get('/profile/edit', isLoggedIn, profileController.getEditProfile);
router.post('/profile/edit', isLoggedIn, upload.single('profilePicture'), profileController.postEditProfile);
router.post('/profile/delete-account', isLoggedIn, profileController.deleteAccount);

module.exports = router;