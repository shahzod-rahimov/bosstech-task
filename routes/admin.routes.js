const { Router } = require("express");

const handleValidationErrors = require("../middlewares/handleValidationErrors");
const Validator = require("../middlewares/validator");
const { body, param, query } = require("express-validator");
const {
  getAll,
  getByID,
  updateAdmin,
  removeAdmin,
  signin,
  signup,
  logout,
} = require("../controllers/admin.controller");
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

router.patch(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  updateAdmin
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  removeAdmin
);

router.post("/auth/signup", Validator("admin"), signup);

router.post(
  "/auth/signin",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    handleValidationErrors,
  ],
  signin
);

router.post(
  "/auth/logout",
  [body("refreshToken").isJWT(), handleValidationErrors],
  logout
);

module.exports = router;
