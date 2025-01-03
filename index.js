const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { createDbConnection } = require("./db");
const UserModel = require("./model/user.model");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());

// API Route for creating a user
app.post("/create", async (req, res) => {
  console.log(req.body);
  try {
    const user = new UserModel(req.body);
    const result = await user.save();
    res.json({ status: "Success", user: result });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({ status: "ERROR", message: err.message });
  }
});

// API Route for user login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      console.log("user", user);
      if (password === user.password) {
        const token = jwt.sign(
          { email: user.email, name: user.name },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "1d" }
        );
        console.log("token", token);
        res.cookie("token", token);
        return res.json({
          status: "Success",
          user: { email: user.email, name: user.name },
        });
      } else {
        return res.status(401).json("The password is incorrect");
      }
    } else {
      return res.status(404).json("No record existed");
    }
  } catch (err) {
    console.error("Error logging in:", err.message);
    return res.status(500).json("Internal server error");
  }
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.LOCALHOST, () => {
  console.log(`Server started on port ${PORT} !!!`);
  createDbConnection();
});
