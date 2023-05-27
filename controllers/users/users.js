const { User } = require("../../models/Users/User.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Notification = require("../../models/Notifications/Notification.js");
const path = require("path");
const fs = require("fs")
const Token = require("../../models/Users/Tokens/Token.js");
const HTTP_STATUS = require("../../config/status.js");

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
    // await sendEmail(user.email, "Verify Email", message);

    res.send("An Email sent to your account please verify");
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

/* READ */
const getUser = async (req, res) => {
  try {
    const { userId, username, email, phone } = req.query;

    if (
      userId === "undefined" ||
      username === "undefined" ||
      email === "undefined" ||
      phone === "undefined"
    ) {
      return res.status(403).json({
        status: HTTP_STATUS.FORBIDDEN,
        msg: "Please send at least one valid parameter!",
      });
    }

    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (username) {
      user = await User.findOne({ username });
    } else if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({
        status: HTTP_STATUS.NOT_FOUND,
        msg: "User does not exist.",
      });
    }

    res.status(200).json({
      status: HTTP_STATUS.OK,
      data: {
        userId: user._id,
        name: user.name,
        username: user.username,
        bio: user.bio,
        type: user.type,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ phone });

    if (user) {
      res.status(200).json({
        status: HTTP_STATUS.OK,
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
        status: HTTP_STATUS.NOT_FOUND,
        data: "User not found!",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.BAD_REQUEST,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.status(200).json(user.chats);
    //
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const isUserFollowed = async (req, res) => {
  const { myId, userId } = req.params;
  try {
    const user = await User.findById({ _id: myId });
      if (user.followings.includes(userId)) {
        res.status(200).json(true);
      } else {
        res.status(404).json(false);
      }
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

/* UPDATE */
const followUser = async (req, res) => {
  const { myId, userId } = req.params;
  if (userId !== myId) {
    try {
      const user = await User.findById({ _id: myId });
      const currentUser = await User.findById({ _id: userId });
      if (!user.followings.includes(userId)) {
        await user.updateOne({ $push: { followings: userId } });
        await currentUser.updateOne({ $push: { followers: myId } });
        res.status(200).json("User has been followed");
      } else {
        res.status(403).json("You already followed this account");
      }
    } catch (err) {
      res.status(500).json({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        data: err.message,
      });
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
};

const unfollowUser = async (req, res) => {
  const { myId, userId } = req.params;
  if (userId !== myId) {
    try {
      const user = await User.findById({ _id: myId });
      const currentUser = await User.findById({ _id: userId });
      if (user.followings.includes(userId)) {
        await user.updateOne({ $pull: { followings: userId } });
        await currentUser.updateOne({ $pull: { followers: myId } });
        res.status(200).json("User has been unfollowed");
      } else {
        res.status(403).json("You didn't follow this account");
      }
    } catch (err) {
      res.status(500).json({
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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

    const user = await User.findById({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    await User.findByIdAndUpdate(userId, {
      $set: req.body,
    });

    res.status(200).json({
      status: HTTP_STATUS.OK,
      data: "Account has been updated!",
    });
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById({ _id: userId });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    //
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../${process.env.MULTER_TARGET_PATH}/${userId}.jpg`);

    fs.rename(tempPath, targetPath, (err)=>{
      if(err){
        console.log(err);
        return res.status(400).json({
          status: HTTP_STATUS.BAD_REQUEST,
          data: err.message,
        });
      }else{
        fs.unlink(tempPath, ()=>{})
        return res.status(200).json({
          status: HTTP_STATUS.OK,
          data: "Avatar Uploaded Successfully!",
        });
      }
    })

    
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      data: err.message,
    });
  }
}

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
    res.status(200).json(HTTP_STATUS.OK, "Account has been deleted!");
  } catch (err) {
    res.status(500).json({
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
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
  isUserFollowed,
  getUserChats,
  getUserCoupons,
  getUserLinks,
  getUserNotifications,
  getUser,
  getUserByPhone,
  getUserToken,
  getUserImages,
  searchUsers,
  checkUsername,
  uploadAvatar,
};
