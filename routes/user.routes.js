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
  getUserImage,
} = require("../controllers/user.controller");
const handleValidationErrors = require("../middlewares/handleValidationErrors");
const Validator = require("../middlewares/validator");
const { body, param, query, cookie } = require("express-validator");
const { fileUpload } = require("../services/FileService");
const adminPolice = require("../middlewares/adminPolice");
const userPolice = require("../middlewares/userPolice");

const router = Router();

router.get(
  "/",
  adminPolice,
  [
    query("page").isNumeric().withMessage("Page query value must be a number"),
    handleValidationErrors,
  ],
  getAll
);

router.get(
  "/:id",
  userPolice,
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  getByID
);

router.post("/", Validator("user"), createUser);

router.patch(
  "/:id",
  userPolice,
  fileUpload.single("image"),
  [
    param("id").isMongoId().withMessage("Invalid ID"),
    body("full_name").optional().isString(),
    body("email").optional().isEmail(),
    body("phone_number").optional().isMobilePhone("uz-UZ"),
    handleValidationErrors,
  ],
  updateUser
);

router.delete(
  "/:id",
  userPolice,
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  removeUser
);

router.post(
  "/auth/signup",
  fileUpload.single("image"),
  [
    body("full_name").isString(),
    body("email").isEmail(),
    body("phone_number").isMobilePhone("uz-UZ"),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .withMessage("Password is not strong"),
    handleValidationErrors,
  ],
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

router.get(
  "/auth/logout",
  [cookie("refreshToken").isJWT(), handleValidationErrors],
  logout
);

router.get(
  "/image/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  getUserImage
);

module.exports = router;
