require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_I = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  firstname: {
    type: String,
    required: true,
    maxlength: 100
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 100
  },
  cart: {
    type: Array,
    default: []
  },
  history: {
    type: Array,
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  token: {
    type: String
  }
});

userSchema.pre("save", function(next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(SALT_I, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

userSchema.methods.generateToken = function(callback) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), process.env.SECRET);

  user.token = token;
  user.save(function(err, user) {
    if (err) return callback(err);
    callback(null, user);
  });
};

userSchema.statics.findByToken = function(token, callback) {
  const user = this;

  jwt.verify(token, process.env.SECRET, function(err, decode) {
    user.findOne({ _id: decode, token: token }, function(err, foundUser) {
      if (err) return callback(err);
      callback(null, foundUser);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
