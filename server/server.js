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
const { Brand } = require("./models/brand");
const { Wood } = require("./models/wood");
const { Product } = require("./models/product");

//== Middleware
const { auth } = require("./middleware/auth");
const { admin } = require("./middleware/admin");

//===================
//      PRODUCTS
//===================

app.get("/api/products", (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;

  Product.find()
    .populate("brand")
    .populate("wood")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) return res.status(400).send(err);
      res.status(200).send(products);
    });
});

app.get("/api/products/product_by_id", (req, res) => {
  let type = req.query.type;
  let items = req.query.id;

  if (type === "array") {
    let ids = req.query.id.split(",");
    items = [];
    items = ids.map(item => {
      return mongoose.Types.ObjectId(item);
    });
  }

  Product.find({ _id: { $in: items } })
    .populate("brand")
    .populate("wood")
    .exec((err, products) => {
      return res.status(200).send(products);
    });
});

app.post("/api/products", auth, admin, (req, res) => {
  const product = new Product(req.body);

  product.save((err, productData) => {
    if (err) return res.json({ success: false, err });

    res.status(200).json({ success: true, product: productData });
  });
});

//===================
//      WOODS
//===================

app.post("/api/products/wood", auth, admin, (req, res) => {
  const wood = new Wood(req.body);

  wood.save((err, woodData) => {
    if (err) return res.json({ success: false, err });

    res.status(200).json({ success: true, wood: woodData });
  });
});

app.get("/api/products/woods", (req, res) => {
  Wood.find({}, (err, woods) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(woods);
  });
});

//===================
//      BRAND
//===================

app.post("/api/products/brand", auth, admin, (req, res) => {
  const brand = new Brand(req.body);

  brand.save((err, productData) => {
    if (err) return res.json({ success: false, err });

    res.status(200).json({ success: true, brand: productData });
  });
});

app.get("/api/products/brands", (req, res) => {
  Brand.find({}, (err, brands) => {
    if (err) return res.status(400).send(err);
    res.status(200).send(brands);
  });
});

//===================
//      USERS
//===================

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

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.user._id
    },
    { token: "" },
    (err, userData) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
