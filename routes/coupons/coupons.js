const express = require("express");
const {
  createCoupon,
  updateCoupon,
  likeCoupon,
  deleteCoupon,
  getCoupons,
  getSingleCoupon,
} = require("../../controllers/coupons/coupons.js");
const { verifyToken } = require("../../middlewares/auth.js");

const router = express.Router();

/* CREATE */
router.post("/", verifyToken, createCoupon);

/* READ */
router.get("/:key?", getCoupons);
router.get("/:couponId", getSingleCoupon);

/* UPDATE */
router.put("/:id", verifyToken, updateCoupon);
router.put("/:id/like", verifyToken, likeCoupon);

/* DELETE */
router.delete("/:id", deleteCoupon);

module.exports = router;
