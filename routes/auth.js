const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const { isLoggedIn } = require('../middleware/auth');

// --- INTERSEPTOR STRUKTUR EKSPOR MULTER (DEFENSIVE PORT ROUTING) ---
const multerModuleImport = require('../config/multerConfig');

let upload;
if (multerModuleImport && typeof multerModuleImport.single === 'function') {
    // Jika berkas multerConfig langsung mengekspor instansi Multer (module.exports = upload)
    upload = multerModuleImport;
} else if (multerModuleImport && multerModuleImport.upload && typeof multerModuleImport.upload.single === 'function') {
    // Jika berkas multerConfig mengekspor objek literal (module.exports = { upload })
    upload = multerModuleImport.upload;
} else {
    // Jalur penyelamatan darurat jika konfigurasi internal multerConfig tidak mengekspor properti valid
    const multer = require('multer');
    const path = require('path');
    const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/img/profiles')),
        filename: (req, file, cb) => cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`)
    });
    upload = multer({ storage: storage });
}

// --- USER AUTHENTICATION ENDPOINTS ---

// GET: Render the Sign In UI layout
router.get('/login', authController.getLogin);

// POST: Execute the authentication credentials check
router.post('/login', authController.postLogin);

// GET: Render the Sign Up registration UI layout
router.get('/register', authController.getRegister);

// POST: Process and save new customer credentials into MongoDB
router.post('/register', authController.postRegister);

// GET: Clear current user operational sessions and redirect
router.get('/logout', authController.logout);


// --- CUSTOMER PROFILE MANAGEMENT ENDPOINTS ---

// GET: Render secure personalized dashboard and transaction history records
router.get('/profile', isLoggedIn, profileController.getProfile);

// GET: Render form data editor to update profile fields
router.get('/profile/edit', isLoggedIn, profileController.getEditProfile);

// POST: Handle binary profile image uploads and text updates simultaneously
router.post('/profile/edit', isLoggedIn, upload.single('profilePicture'), profileController.postEditProfile);

// POST: Secure transactional account erasure routing
router.post('/profile/delete-account', isLoggedIn, profileController.deleteAccount);

module.exports = router;