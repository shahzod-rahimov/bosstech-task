const { Router } = require("express");
const {
  getAll,
  getByID,
  createUser,
  updateUser,
  removeUser,
} = require("../controllers/user.controller");
const router = Router();

router.get("/", getAll);
router.get("/:id", getByID);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", removeUser);

module.exports = router;
