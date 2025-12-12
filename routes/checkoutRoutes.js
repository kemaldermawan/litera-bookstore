const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { isLoggedIn, mustCompleteProfile } = require("../middleware/auth");

router.get("/buy-now/:bookId", isLoggedIn, mustCompleteProfile, checkoutController.buyNow);
router.get("/checkout", isLoggedIn, mustCompleteProfile, checkoutController.checkoutCart);
router.post("/checkout", isLoggedIn, mustCompleteProfile, checkoutController.createOrder);

module.exports = router;
