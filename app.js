const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.get("/", (req, res) => {
    return res.render("pages/landing");
});
app.get("/cart", (req, res) => {
    return res.render("pages/cart");
});
app.get("/profile", (req, res) => {
    return res.render("pages/profile");
});
app.get("/login", (req, res) => {
    return res.render("pages/login");
});
app.get("/register", (req, res) => {
    return res.render("pages/register");
});
app.get("/index", (req, res) => {
    return res.render("pages/index");
});
app.get("/bookDetail", (req, res) => {
    return res.render("pages/bookDetail");
});
app.get("/orderSuccess", (req, res) => {
    return res.render("pages/orderSuccess");
});
app.get("/checkout", (req, res) => {
    return res.render("pages/checkout");
});
app.get("/review", (req, res) => {
    return res.render("pages/review");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));