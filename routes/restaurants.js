const express = require("express");
const router = express.Router();
const restaurantsModel = require("../models/restaurants");
const dishModel = require("../models/dish");

router.post("/create", async (req, res) => {
  console.log(req.body);
  const { name, location } = req.body;

  if (!location || !name) {
    return res.status(400).send("All fields are required!");
  }
  const newRestaurants = new restaurantsModel({
    name,
    location,
  });

  try {
    const createRestaurants = await newRestaurants.save();
    res.status(201).send("order placed at " + createRestaurants.id);
  } catch (e) {
    res.status(501).send(e.message);
  }
});

router.get("/allRestaurants", async (req, res) => {
  console.log("show all restaurnats");
  let restaurants = await restaurantsModel.find({});
  res.status(201).send("all Restuarants" + restaurants);
});

router.get("/:id/alldishes", async (req, res) => {
  console.log("show all restaurnats");
  let id = req.params.id;
  let restaurants = await restaurantsModel.findById(id);
  let dish = await restaurants.offeredDishes;
  let alldishes = [];
  dish.forEach(async (element) => {
    let eachDish = await dishModel.findById(element);
    alldishes.push(eachDish);
  });
  res.send(alldishes);
});

router.post("/:id/adddish", async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const { name, cuisine, cost, sellPrice } = req.body;
  const dish = new dishModel({
    name,
    cuisine,
    cost,
    sellPrice,
  });
  await dish.save();
  let id = req.params.id;
  let restaurant = await restaurantsModel.findById(id);
  let add = await restaurant.offeredDishes.push(dish);
  await restaurant.save();
  res.send(restaurant.offeredDishes);
  res.send("end point reached");
});

module.exports = router;
