require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const DB_URL =
  "mongodb+srv://123:123@cluster0.ytqrtda.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DB_URL, {
    useUnifiedTopology: true,
    useNewURLParser: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({}));
app.use(morgan("dev"));
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/orders");
const restaurantRouter = require("./routes/restaurants");

app.use("/auth", authRouter);
app.use("/orders", orderRouter);
app.use("/restaurants", restaurantRouter);

app.listen(8000);
