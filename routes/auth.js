const router = require("express").Router();
const {
  register,
  login,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.patch("/reset-password", resetPassword);

module.exports = router;
