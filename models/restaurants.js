const mongoose = require("mongoose");

const restaurantsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  offeredDishes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "dish",
    },
  ],
  allOrder: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const restaurantsModel = mongoose.model("restaurants", restaurantsSchema);
module.exports = restaurantsModel;
