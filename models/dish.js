const mongoose = require("mongoose");

const dishSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cuisine: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: false,
  },
  cost: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const dishModel = mongoose.model("dish", dishSchema);
module.exports = dishModel;
