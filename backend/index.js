require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const uploadRouter = require("./routes/upload");
const usersRouter = require("./routes/users");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/upload", uploadRouter);
app.use("/users", usersRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
