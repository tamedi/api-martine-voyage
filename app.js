var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var profilRouter = require("./routes/profil");
const productsRouter = require("./routes/products");

//import de mongoose
const mongoose = require("mongoose");
//import de cors
const cors = require("./middlewares/cors");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors.handle);

//data base connection
mongoose.connect("mongodb://localhost:27017/api-back-martine", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => {
  console.log("database connected");
});

// routes
app.use("/", indexRouter);
app.use("/profil", profilRouter);
app.use("/products", productsRouter);

module.exports = app;
