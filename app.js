const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes/index.routes");
const limiter = require("./middlewares/rate-limiter");
const errorHandler = require("./middlewares/ErrorHandlingMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const { errLogger, winstonLogger } = require("./middlewares/loggerMiddleware");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require('path')

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(winstonLogger);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors());
// app.use(limiter);

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.use(express.static(path.join(__dirname, "./views")));

app.use("/api/v1/", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post("/charge", (req, res) => {
  try {
    stripe.customers
      .create({
        name: req.body.name,
        email: req.body.email,
        source: req.body.stripeToken,
      })
      .then((customer) =>
        stripe.charges.create({
          amount: req.body.amount * 100,
          currency: "usd",
          customer: customer.id,
        })
      )
      .then(() => res.render("completed.html"))
      .catch((err) => console.log(err));
  } catch (err) {
    res.send(err);
  }
});

app.use(errLogger);
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

module.exports = app;
