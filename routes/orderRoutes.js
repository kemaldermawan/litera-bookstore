const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { isLoggedIn } = require("../middleware/auth");

router.get("/order-success/:orderId", isLoggedIn, async (req, res) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.redirect("/");

    res.render("pages/orderSuccess", { order });
});

module.exports = router;
