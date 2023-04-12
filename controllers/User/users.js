const { User } = require("../../models/Accounts/User.js");
const Coupon = require("../../models/Coupons/Coupon.js");
const bcrypt = require("bcrypt");
const crypto = import("crypto");
const Link = require("../../models/Links/Link.js");
const Notification = require("../../models/Notifications/Notification.js");
const path = require("path");
const Token = require("../../models/Tokens/Token.js");
const sendEmail = require("../../utils/email.js");
const { STATUS } = require("../../config/status.js");

/* CREATE */
const createUserToken = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(400).send("User with given id is not exist!");

    const token = await Token({
      userId: user._id,
      token: (await crypto).randomBytes(32).toString("hex"),
    }).save();

    const message = `${process.env.BASE_URL}/users/${user.id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", message);

    res.send("An Email sent to your account please verify");
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

/* READ */
const getUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (user) {
      res.status(200).json({
        status: "success",
        data: {
          userId: user._id,
          name: user.name,
          username: user.username,
          desc: user.desc,
          type: user.type,
        },
      });
    } else {
      res.status(404).json({
        status: "failed",
        data: "User not found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const getUserToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const getUserCoupons = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const userCoupons = await Coupon.find({ userId: user._id }).sort({
      $natural: -1,
    });
    if (userCoupons.length === 0) {
      res.status(404).json("Not found any coupon");
    } else {
      res.status(200).json({ view: view++, coupons: userCoupons });
    }
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const getUserLinks = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const userLinks = await Link.find({ userId: user._id }).sort({
      $natural: -1,
    });
    if (userLinks.length === 0) {
      res.status(404).json("Not found any link");
    } else {
      res.status(200).json(userLinks);
    }
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const userNotifications = await Notification.find({
      userId: user._id,
    }).sort({
      $natural: -1,
    });
    if (userNotifications.length === 0) {
      res.status(404).json("Not found any link");
    } else {
      res.status(200).json(userNotifications);
    }
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findById(userId);

    // if (currentUser) return res.status(200).json("success");

    // Number of followers
    User.countDocuments({ id: currentUser.followers }, async (err, count) => {
      try {
        // Query for followers
        const query = { id: currentUser.followers };

        const userFollowers = await User.find(query).sort({
          $natural: -1,
        });

        if (userFollowers.length === 0) {
          res.status(404).json("There is any follower here");
        } else {
          res.status(200).json({
            count: count,
            followers: userFollowers,
          });
        }
      } catch (err) {
        res.status(500).json({
          status: "failed",
          data: err.message,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      data: err.message,
    });
  }
};

const getUserFollowings = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);

    // query for follower
    const query = { _id: currentUser.followings };

    const userFollowings = await User.find(query).sort({
      $natural: -1,
    });
    if (userFollowings.length === 0) {
      res.status(404).json("There is any following here");
    } else {
      res.status(200).json(userFollowings);
    }
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).sort({ $natural: -1 });
    if (allUsers.length === 0) {
      res.status(404).json("Not found any user");
    } else {
      res.status(200).json(allUsers);
    }
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const getUserImages = async (req, res) => {
  try {
    const { userId } = req.params;
    const targetPath = path.join(
      __dirname,
      `../uploads/images/profiles/${userId}.jpg`
    );

    res.sendFile(targetPath);
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    let data = await User.find({
      $or: [
        { name: { $regex: req.params.key } },
        { username: { $regex: req.params.key } },
        { email: { $regex: req.params.key } },
      ],
    });
    if (data.length === 0) {
      return res.status(400).json("Not Found!");
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { key } = req.params;
    if (key) {
      let data = await User.find({
        $or: [{ username: { $regex: key } }],
      });
      if (data.length === 0) {
        return res.status(200).json(true);
      } else {
        return res.status(404).json("Not Available!");
      }
    } else {
      const allCoupons = await User.find({}).sort({ $natural: -1 });
      if (allCoupons.length === 0) {
        res.status(200).json(true);
      } else {
        res.status(404).json("Not Available!");
      }
    }
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

/* UPDATE */
const followUser = async (req, res) => {
  const { myId, userId } = req.params;
  if (userId !== id) {
    try {
      const user = await User.findById({ _id: myId });
      const currentUser = await User.findById({ _id: userId });
      if (!user.followers.includes(userId)) {
        await user.updateOne({ $push: { followers: userId } });
        await currentUser.updateOne({ $push: { followings: myId } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already followed this account");
      }
    } catch (err) {
      res.status(500).json({
        status: STATUS.Failed,
        data: err.message,
      });
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
};

const unfollowUser = async (req, res) => {
  const { id, userId } = req.params;
  if (userId !== id) {
    try {
      const user = await User.findById({ _id: id });
      const currentUser = await User.findById({ _id: userId });
      if (user.followers.includes(userId)) {
        await user.updateOne({ $pull: { followers: userId } });
        await currentUser.updateOne({ $pull: { followings: id } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You didn't follow this account");
      }
    } catch (err) {
      res.status(500).json({
        status: STATUS.Failed,
        data: err.message,
      });
    }
  } else {
    res.status(403).json("You can't unfollow yourself");
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    const user = await User.findById({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    await User.findByIdAndUpdate(userId, {
      $set: req.body,
    });

    res.status(204).json({
      status: "success",
      data: "Account has been updated!",
    });
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

/* DELETE */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    const user = await User.findById({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    await User.findByIdAndDelete(userId);
    res.status(200).json("Account has been deleted!");
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

module.exports = {
  createUserToken,
  deleteUser,
  updateUser,
  unfollowUser,
  followUser,
  getAllUsers,
  getUserFollowings,
  getUserFollowers,
  getUserCoupons,
  getUserLinks,
  getUserNotifications,
  getUser,
  getUserToken,
  getUserImages,
  searchUsers,
  checkUsername,
};
