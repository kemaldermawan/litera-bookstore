const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, profileController.getProfile);
router.post('/update-address', isLoggedIn, profileController.updateAddress);

module.exports = router;
