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
  unfollowUser,
  searchUsers,
  checkUsername,
  getUserNotifications,
  getUserImages,
  getUserChats,
  isUserFollowed,
  uploadAvatar,
  getUserAvatar,
  deleteUserAvatar,
} = require("../../controllers/users/users.js");
const { verifyToken } = require("../../middlewares/auth.js");
const multer = require("multer");
const upload = multer({
  dest: process.env.MULTER_TEMP_PATH,
})

const router = express.Router();

/* CREATE */
router.post("/:userId", createUserToken);

/* READ */
router.get("/", getUser);
router.get("/:userId/verify/:token", getUserToken);
router.get("/:userId/followers", getUserFollowers);
router.get("/:userId/followings", getUserFollowings);
router.get("/isfollowed/:myId/:userId", isUserFollowed);
router.get("/:userId/chats", getUserChats);
// router.get("/:userId/coupons", getUserCoupons);
router.get("/:userId/links", getUserLinks);
router.get("/:userId/notifications", getUserNotifications);
router.get("/:userId/images", getUserImages);
router.get("/search/:key", searchUsers);
router.get("/username/:username", checkUsername);
router.get("/:userId/avatar", getUserAvatar);

/* UPDATE */
router.put("/follow/:myId/:userId", /* verifyToken, */ followUser);
router.put("/unfollow/:myId/:userId", /* verifyToken, */ unfollowUser);
router.put("/:userId", /* verifyToken, */ updateUser);
router.put("/:userId/avatar", /* verifyToken, */ upload.single("avatar"), uploadAvatar);

/* DELETE */
router.delete("/:userId", /* verifyToken, */ deleteUser);
router.delete("/:userId/avatar", /* verifyToken, */ deleteUserAvatar);

module.exports = router;
