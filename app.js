const express = require("express");

const app = express();
const mongoose = require("mongoose");

const routes = require("./routes");

const { PORT = 3001 } = process.env;

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  () => {
    console.log("connected to DB");
  },
  (e) => console.log("DB error", e),
);
app.use((req, res, next) => {
  req.user = {
    _id: "65e0c3d4add728a0be390fe2",
  };
  next();
});

app.use(express.json());
app.use(routes);

console.log("!!!");

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
