require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3002;

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//== Models
const { User } = require("./models/user");

//============
//  USER ROUTE
//============

app.post("/api/users/register", (req, res) => {
  res.status(200);
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
