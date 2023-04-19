const { Router } = require("express");

const handleValidationErrors = require("../middlewares/handleValidationErrors");
const Validator = require("../middlewares/validator");
const { body, param, query } = require("express-validator");
const {
  getAll,
  getByID,
  createOrder,
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

// router.patch(
//   "/:id",
//   [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
//   updateAdmin
// );

// router.delete(
//   "/:id",
//   [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
//   removeAdmin
// );

module.exports = router;
