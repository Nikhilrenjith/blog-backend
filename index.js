const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./src/db/db");
const UserModel = require("./src/models/user");

const app = express();
const PORT = 4000;
const secret = "7AoYv4F9mlCcK9p4Cs4F";

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Middleware to create and attach the token to the response
const attachTokenToResponse = (res, user) => {
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    secret,
    {
      expiresIn: "1h", // Set expiration time (e.g., 1 hour)
    }
  );

  // Attach the token to the response as an HTTP-only cookie
  res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 }); // 1 hour in milliseconds
};

// Test
app.get("/test", (req, res) => {
  res.json("test ok");
});

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserModel({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    // Attach token to response
    attachTokenToResponse(res, newUser);

    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during user registration:", error.message);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (user) {
      const passwordMatch = bcrypt.compareSync(password, user.password);

      if (passwordMatch) {
        // Attach token to response
        attachTokenToResponse(res, user);

        res.status(200).json({ message: "Login successful", user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Error during login" });
  }
});

// Database
db.dbconnect();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
