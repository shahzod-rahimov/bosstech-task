const { Router } = require("express");
const Validator = require("../middlewares/validator");
const {
  getAll,
  getByID,
  createProduct,
  updateProduct,
  removeProduct,
} = require("../controllers/product.controller");
const { query, param } = require("express-validator");
const handleValidationErrors = require("../middlewares/handleValidationErrors");

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

router.post("/", Validator("product"), createProduct);

router.patch(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  Validator("product"),
  updateProduct
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  removeProduct
);

module.exports = router;
