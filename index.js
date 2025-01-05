const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { createDbConnection } = require("./db");
const UserModel = require("./model/user.model");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://password-reset-flow-client-ui.netlify.app",
      "http://0.0.0.0:10000",
    ],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());

// API Route for creating a user
app.post(
  "/create",
  async (req, res) => {
    console.log(req.body);
    try {
      const user = new UserModel(req.body);
      const result = await user.save();
      res.json({ status: "Success", user: result });
    } catch (err) {
      console.error("Error creating user:", err.message);
      res.status(500).json({ status: "ERROR", message: err.message });
    }
  }
);

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
        alert("The password is incorrect");
        return res.status(401).json("The password is incorrect");
      }
    } else {
      alert("No record existed");
      return res.status(404).json("No record existed");
    }
  } catch (err) {
    console.error("Error logging in:", err.message);
    return res.status(500).json("Internal server error");
  }
});

app.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetURL = `https://password-reset-flow-client-ui.netlify.app/resetpassword/${user._id}/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Link",
      text: `Click the link to reset your password: ${resetURL}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ status: "Error", message: error.message });
      } else {
        console.log("Email sent:", info.response);
        return res.json({
          status: "Success",
          message: "Email sent successfully",
        });
      }
    });
  } catch (err) {
    console.error("Error in /forgotpassword:", err.message);
    return res.status(500).json({ status: "Error", message: err.message });
  }
});

app.post("/resetpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.json({ status: "Error with token" });
      }

      try {
        const user = await UserModel.findByIdAndUpdate(
          id,
          { password: password },
          { new: true }
        );

        if (user) {
          return res.json({
            status: "Success",
            message: "Password updated successfully",
          });
        } else {
          return res
            .status(404)
            .json({ status: "Error", message: "User not found" });
        }
      } catch (updateError) {
        return res
          .status(500)
          .json({ status: "Error", message: updateError.message });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "Error", message: "Internal server error" });
  }
});

// Starting the server
app.listen(`${process.env.PORT}`, `${process.env.HOSTNAME}`, function () {
  createDbConnection();
});
