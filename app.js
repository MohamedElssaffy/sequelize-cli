const { sequelize, User, Post } = require("./models");
const express = require("express");
const post = require("./models/post");

const app = express();

app.use(express.json());

app.post("/users", async (req, res) => {
  try {
    const user = await User.create({ ...req.body });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({ include: "posts" });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "somthing went wrong" });
  }
});

app.get("/users/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const user = await User.findOne({ where: { uuid } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "somthing went wrong" });
  }
});

app.post("/posts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({
      where: {
        uuid: userId,
      },
    });
    const post = await Post.create({ ...req.body, userId: user.id });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "somthing went wrong" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.findAll({ include: "user" });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "somthing went wrong" });
  }
});

app.listen(3000, async () => {
  console.log("serever is runing");
  await sequelize.authenticate();
  console.log("db is connect");
});
