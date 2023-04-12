const Coupon = require("../../../models/Coupons/Coupon.js");
const { User } = require("../../../models/Users/User.js");
const Comment = require("../../../models/Coupons/Comments/Comment.js");

/* CREATE */
const createComment = async (req, res) => {
  try {
    const { userId, text, couponId } = req.body;
    const comment = Comment({
      userId: userId,
      text: text,
      coupon: couponId,
    });
    await comment.save();

    const coupon = await Coupon.findById({ _id: couponId });
    await coupon.updateOne({ $push: { comments: comment._id } });

    const user = await User.findById({ _id: userId });
    await user.updateOne({ $push: { comments: comment._id } });

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* READ */

/* UPDATE */

/* DELETE */

module.exports = { createComment };
