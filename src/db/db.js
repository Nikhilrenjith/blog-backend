// db.js

const mongoose = require("mongoose");

// Connect to MongoDB
const dbconnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://nikhil:nikhil@dashboard-cluster.9t93x8a.mongodb.net/blog-data"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = {
  dbconnect,
};
