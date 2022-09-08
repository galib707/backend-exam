const express = require("express");
const router = express.Router();
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

router.post("/signup", async (req, res) => {
  console.log(req.body);
  const { name, email, password, retyped_password } = req.body;

  if (!email || !name || !password || !retyped_password) {
    return res.status(400).send("All fields are required!");
  }
  if (password !== retyped_password) {
    return res.status(400).send("password & confirmPassword does not match");
  }

  const existingUser = await userModel.findOne({ email: email });
  if (existingUser != null) {
    return res.status(400).send("Email already exists!");
  }

  //   Generate password HASH
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password.toString(), salt);

  //   //creating document/account for entered details
  const newUser = new userModel({
    name,
    email,
    password: hash,
    retyped_password: retyped_password,
  });

  try {
    //saving the doc/account to database collection
    const saveUser = await newUser.save();
    res.status(201).send("User created with ID: " + saveUser.id);
  } catch (e) {
    res.status(501).send(e.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("All fields are required!");
  }

  const existingUser = await userModel.findOne({ email: email });
  if (existingUser == null) {
    return res.status(400).send("Email does not exist!");
  }

  //Compare password HASH
  const ifCorrectPassword = await bcrypt.compare(
    password,
    existingUser.password
  );
  if (!ifCorrectPassword) {
    res.status(400).send("Invalid Password Provided!");
  } else {
    const payload = {
      id: existingUser.id,
      email: existingUser.email,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
    });
    // refreshTokens.push(refreshToken);

    res.status(200).json({ accessToken, refreshToken, existingUser });
    // res.status(200).json(existingUser.toJSON());
  }
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(401).send("Please provie Refresh Token");
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    delete payload.exp;
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
    });

    return res.status(200).send({ accessToken });
  } catch (err) {
    return res.status(401).send("ERROR : " + err.message);
  }
});

module.exports = router;
