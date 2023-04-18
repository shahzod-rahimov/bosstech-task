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
const { body } = require("express-validator");
const router = Router();

router.get("/", getAll);
router.get("/:id", getByID);
router.post("/", Validator("user"), createUser);
router.patch("/:id", updateUser);
router.delete("/:id", removeUser);
router.post(
  "/auth/signup",
  [handleValidationErrors],
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
router.post("/auth/logout", logout);

module.exports = router;
