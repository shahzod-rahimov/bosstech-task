const { Router } = require("express");
const {
  getAll,
  getByID,
  createUser,
  updateUser,
  removeUser,
} = require("../controllers/user.controller");
const Validator = require("../middlewares/validator");
const router = Router();

router.get("/", getAll);
router.get("/:id", getByID);
router.post("/", Validator("user"), createUser);
router.patch("/:id", updateUser);
router.delete("/:id", removeUser);

module.exports = router;
