const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User } = require("./models/user");

const app = express();
const PORT = 3000;
const JWT_SECRET = "8vdbjsy73423429999sajbh73949nadkur4ew";

//json parser middleware
app.use(express.json());

app.use((req, res, next) => {
  const authHeader = req.header("Authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, JWT_SECRET);
  }
  next();
});

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

app.get("/secret", requireLogin, (req, res) => {
  // app.render("/index.ejs");
  if (req.user) {
    res.json({ message: `Hello ${req.user.username}` });
  } else {
    res.sendStatus(401);
  }
});

app.post("/tokens", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.login(username, password);
  if (user) {
    const userId = user._id.toString();
    const token = jwt.sign({ userId, username: user.username }, JWT_SECRET, {
      expiresIn: "1h",
      subject: userId,
    });
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.json({ username });
});

mongoose.connect("mongodb://127.0.0.1/backend1");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(PORT, () => {
  console.log(`Started express server on port: ${PORT}`);
});
