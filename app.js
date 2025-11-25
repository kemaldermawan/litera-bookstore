const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// Gunakan route yang baru kita buat
const bookRoutes = require("./routes/bookRoutes");

dotenv.config();
connectDB();

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));

// Gunakan bookRoutes untuk halaman utama
app.use("/", bookRoutes);

// Route statis lainnya (bisa dipindahkan ke controller nanti)
app.get("/cart", (req, res) => res.render("pages/cart"));
app.get("/login", (req, res) => res.render("pages/login"));
app.get("/register", (req, res) => res.render("pages/register"));
app.get("/profile", (req, res) => res.render("pages/profile"));
app.get("/bookDetail", (req, res) => res.render("pages/bookDetail"));
app.get("/checkout", (req, res) => res.render("pages/checkout"));
app.get("/orderSuccess", (req, res) => res.render("pages/orderSuccess"));
app.get("/review", (req, res) => res.render("pages/review"));
app.get("/dashboard", (req, res) => res.render("admin/dashboard"));
app.get("/editBook", (req, res) => res.render("admin/editBook"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));