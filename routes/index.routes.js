const { Router } = require("express");
const UserRouter = require("./user.routes");
const ProductRouter = require("./product.routes");
const AdminRouter = require("./admin.routes");
const response = require("./responses.routes");

const router = Router();
router.use(response);
router.use("/users", UserRouter);
router.use("/products", ProductRouter);
router.use("/admin", AdminRouter);

module.exports = router;
