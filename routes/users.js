const express = require("express");
const {
  createUserToken,
  getUser,
  getUserToken,
  getUserFollowers,
  getUserFollowings,
  followUser,
  updateUser,
  deleteUser,
  getUserCoupons,
  getUserLinks,
  getAllUsers,
  unfollowUser,
  searchUsers,
  checkUsername,
  getUserNotifications,
  getUserImages,
} = require("../controllers/users.js");
const { verifyToken } = require("../middlewares/auth.js");

const router = express.Router();

/* CREATE */
router.post("/:userId", createUserToken);

/* READ */
router.get("/:username", getUser);
router.get("/:userId/verify/:token", getUserToken);
router.get("/followers/:userId", getUserFollowers);
router.get("/:userId/followings", getUserFollowings);
router.get("/:userId/coupons", getUserCoupons);
router.get("/:userId/links", getUserLinks);
router.get("/:userId/notifications", getUserNotifications);
router.get("/", getAllUsers);
router.get("/:userId/images", getUserImages);
router.get("/search/:key", searchUsers);
router.get("/username/:username", checkUsername);

/* UPDATE */
router.put("/:userId/follow/:myId", verifyToken, followUser);
router.put("/:userId/unfollow/:id", verifyToken, unfollowUser);
router.put("/:userId", verifyToken, updateUser);

/* DELETE */
router.delete("/:userId", verifyToken, deleteUser);

module.exports = router;