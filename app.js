const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const connectDB = require('./config/db');
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.render("pages/index");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));