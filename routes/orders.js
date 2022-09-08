const express = require("express");
const router = express.Router();
const orderModel = require("../models/order");
const restaurantsModel = require("../models/restaurants");
const mongoose = require("mongoose");

router.post("/place", async (req, res) => {
  const { name, quantity, status } = req.body;
  const newOrder = new orderModel({
    name,
    quantity,
    status,
  });
  try {
    const palecedNewOrder = await newOrder.save();
    res.status(201).send("restaurants created " + palecedNewOrder.id);
  } catch (e) {
    res.status(501).send(e.message);
  }
});

module.exports = router;
