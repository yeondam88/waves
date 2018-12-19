const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    isRequired: true,
    unique: 1,
    maxlength: 100
  }
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = { Brand };
