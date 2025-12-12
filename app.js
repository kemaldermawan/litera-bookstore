const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require("express-session");
const MongoStore = require("connect-mongo");

const bookRoutes = require("./routes/bookRoutes");
const adminBookRoutes = require('./routes/adminBooks');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const profileRoutes = require('./routes/profileRoutes');
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
connectDB();

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Gunakan Session
app.use(session({
    secret: "secret-key-anda",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 hari
    }
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// Gunakan bookRoutes untuk halaman utama
app.use("/", bookRoutes);
app.use('/admin/books', adminBookRoutes);
app.use('/', reviewRoutes);
app.use('/', require('./routes/auth'));
app.use("/", require("./routes/orderRoutes"));
app.use('/profile', profileRoutes);
app.use("/", checkoutRoutes);
app.use("/", orderRoutes);
app.use("/", cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));