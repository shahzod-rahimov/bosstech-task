const { Router } = require("express");
const UserRouter = require("./user.routes");
const response = require("./responses.routes");

const router = Router();
router.use(response);
router.use("/users", UserRouter);

module.exports = router;
