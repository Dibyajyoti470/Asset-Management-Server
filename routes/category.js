const router = require("express").Router();
const { createCategory, getAllCategories } = require("../controllers/category");

router.route("/create").post(createCategory);
router.route("/view-all").get(getAllCategories);

module.exports = router;
