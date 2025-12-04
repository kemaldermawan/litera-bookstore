const express = require('express');
const router = express.Router();
const { isLoggedIn, mustCompleteProfile } = require('../middleware/auth');

router.get('/', isLoggedIn, mustCompleteProfile, (req, res) => {
    res.render('pages/checkout');
});

module.exports = router;
