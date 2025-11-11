const express = require("express");
const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  return res.render("pages/index");
});

app.listen(port, () => {
  console.log(`App is running on port: `, port);
});
