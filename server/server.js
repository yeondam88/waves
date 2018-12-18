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

//== Middleware
const { auth } = require("./middleware/auth");

//============
//  USER ROUTE
//============

app.get("/api/users/auth", auth, (req, res) => {
  const { email, firstname, lastname, role, cart, history } = req.user;
  res.status(200).json({
    isAdmin: role === 0 ? false : true,
    isAuth: true,
    email: email,
    firstname: firstname,
    lastname: lastname,
    role: role,
    cart: cart,
    history: history
  });
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userData) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({
      success: true
    });
  });
});

app.post("/api/users/login", (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (!user)
        return res.json({
          loginSuccess: false,
          message: "Auth failed, email not found."
        });

      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
          return res.json({ loginSuccess: false, message: "Wrong password" });

        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          res
            .cookie("w_auth", user.token)
            .status(200)
            .json({ loginSuccess: true });
        });
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
