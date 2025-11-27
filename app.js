const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const bookRoutes = require("./routes/bookRoutes");
const adminBookRoutes = require('./routes/adminBooks');

dotenv.config();
connectDB();

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Gunakan bookRoutes untuk halaman utama
app.use("/", bookRoutes);

// Gunakan adminBookRoutes untuk halaman admin
app.use('/admin/books', adminBookRoutes);

// Route statis lainnya (bisa dipindahkan ke controller nanti)
app.get("/cart", (req, res) => res.render("pages/cart"));
app.get("/login", (req, res) => res.render("pages/login"));
app.get("/register", (req, res) => res.render("pages/register"));
app.get("/profile", (req, res) => res.render("pages/profile"));
app.get("/bookDetail", (req, res) => res.render("pages/bookDetail"));
app.get("/checkout", (req, res) => res.render("pages/checkout"));
app.get("/orderSuccess", (req, res) => res.render("pages/orderSuccess"));
app.get("/review", (req, res) => res.render("pages/review"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));