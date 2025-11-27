const express = require('express');
const router = express.Router();
const adminBookController = require('../controllers/adminBookController');
const upload = require('../config/multerConfig');

// Dashboard
router.get('/', adminBookController.getDashboard);

// Form edit
router.get('/edit/:id', adminBookController.getEditBook);

// Create (pakai upload)
router.post('/create', upload, adminBookController.createBook);

// Update (pakai upload)
router.post('/update/:id', upload, adminBookController.updateBook);

// Delete
router.post('/delete/:id', adminBookController.deleteBook);

module.exports = router;


