const mongoose = require("mongoose");

const mongoDBURI =
  process.env.NODE_ENV === "development"
    ? "mongodb://localhost:27017/employee"
    : `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_USER_PASSWORD}@notesapplication.jzygn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=notesApplication`;

async function createDbConnection() {
  try {
    await mongoose.connect(mongoDBURI);
    console.log("connection established !!!---");
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  createDbConnection,
};
