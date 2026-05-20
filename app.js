const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require('express-session');
const MongoStore = require('connect-mongo');

dotenv.config();
connectDB();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'litera-secure-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.session = req.session;
    res.locals.cartCount = req.session.cart ? req.session.cart.reduce((sum, item) => sum + item.qty, 0) : 0;
    next();
});

app.get('/', (req, res) => {
    res.render('pages/landing', { 
        pageTitle: 'Welcome to Litera Ecosystem' 
    });
});

app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/store'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong on the Litera Server.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`[Litera Server]: Running on http://localhost:${PORT}`));