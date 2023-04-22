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
const adminPolice = require("../middlewares/adminPolice");
const router = Router();

router.get(
  "/",
  [
    query("page").isNumeric().withMessage("Page query value must be a number"),
    handleValidationErrors,
  ],
  adminPolice,
  getAll
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  adminPolice,
  getByID
);

router.patch(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  adminPolice,
  updateAdmin
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid ID"), handleValidationErrors],
  adminPolice,
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
  adminPolice,
  logout
);

module.exports = router;
