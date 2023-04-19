const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index.routes");
const limiter = require("./middlewares/rate-limiter");
const errorHandler = require("./middlewares/ErrorHandlingMiddleware");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors());
// app.use(limiter);

app.use("/api/v1/", routes);
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(process.env.ATLAS_URL);
    app.listen(PORT, () => console.log("Server runing on PORT -> ", PORT));
  } catch (error) {
    console.log("Server Error", error);
  }
}

start();
