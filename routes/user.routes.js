const { Router } = require("express");
const {
  getAll,
  getByID,
  createUser,
  updateUser,
  removeUser,
  signup,
  signin,
  logout,
} = require("../controllers/user.controller");
const handleValidationErrors = require("../middlewares/handleValidationErrors");
const Validator = require("../middlewares/validator");
const { body, param, query } = require("express-validator");
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

router.post("/", Validator("user"), createUser);

router.patch(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  updateUser
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  removeUser
);

router.post(
  "/auth/signup",
  [
    body("full_name").isString(),
    body("email").isEmail(),
    body("phone_number").isMobilePhone("uz-UZ"),
    body("password").isLength({ min: 6 }),
    handleValidationErrors,
  ],
  Validator("user"),
  signup
);

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
