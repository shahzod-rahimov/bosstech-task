const { Router } = require("express");

const handleValidationErrors = require("../middlewares/handleValidationErrors");
const Validator = require("../middlewares/validator");
const { param, query } = require("express-validator");
const {
  getAll,
  getByID,
  createOrder,
  updateOrder,
  deleteOrder,
  changeStatus,
} = require("../controllers/order.controller");

const router = Router();

router.get(
  "/",
  [
    query("page").isNumeric().withMessage("Page query value must be a number"),
    handleValidationErrors,
  ],
  getAll
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  getByID
);

router.post("/", Validator("order"), createOrder);

router.patch(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  updateOrder
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  deleteOrder
);

router.post(
  "/status",
  [
    query("id").isMongoId().withMessage("Invalid ID"),
    query("status").isNumeric(),
    handleValidationErrors,
  ],
  changeStatus
);

module.exports = router;
