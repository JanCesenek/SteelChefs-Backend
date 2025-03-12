require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuid } = require("uuid");

const authRoutes = require("../routes/auth");
const imagesRoutes = require("../routes/images");
const orderedUnitsRoutes = require("../routes/orderedUnits");
const ordersRoutes = require("../routes/orders");
const productsRoutes = require("../routes/products");
const usersRoutes = require("../routes/users");
const reviewsRoutes = require("../routes/reviews");
const articlesRoutes = require("../routes/articles");
const paymentRoute = require("../routes/payment");

const app = express();
const port = +process.env.PORT || 8080;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.get("/", (_, res) => {
  const luckyCode = uuid();
  res.json(`Success! 😊 Today's lucky code is ${luckyCode}`);
});

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());

app.use(authRoutes);
app.use(imagesRoutes);
app.use(orderedUnitsRoutes);
app.use(ordersRoutes);
app.use(productsRoutes);
app.use(usersRoutes);
app.use(reviewsRoutes);
app.use(articlesRoutes);
app.use(paymentRoute);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
