const router = require("express").Router();
const {
  createAsset,
  getAssetDetails,
  getAllAssets,
  updateAsset,
  deleteAsset,
} = require("../controllers/asset");

router.route("/create").post(createAsset);
router.route("/view-all").get(getAllAssets);
router.route("/view/:assetID").get(getAssetDetails);
router.route("/update/:assetID").patch(updateAsset);
router.route("/delete/:assetID").delete(deleteAsset);

module.exports = router;
