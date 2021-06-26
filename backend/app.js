// Constants
const path = require("path");
const express = require('express');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();
const connString = "mongodb+srv://Matthew:" + process.env.MONGO_ATLAS_PW + "@cluster0.aqrzy.mongodb.net/APDS_POE_Database";

// Connect to database using mongoose to connect to the MongoDB through ExpressJS
// Using MongoDB connection string
mongoose.connect(connString, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true })
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection Failed!');
  });

// Declaring express functions

app.use(express.json()); // Function for JSON parsing
app.use(express.urlencoded({extended: true})); // Function for URL parsing
app.use("/images", express.static(path.join("images"))) // Setting the image storing path

// Declaring headers

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
    );
  next();
});

// Connnect the routes to Express

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
