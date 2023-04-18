const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index.routes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/", routes);

async function start() {
  try {
    await mongoose.connect(process.env.ATLAS_URL);
    app.listen(PORT, () => console.log("Server runing on PORT -> ", PORT));
  } catch (error) {
    console.log("Server Error", error);
  }
}

start();
