const Category = require("../../models/Coupons/Categories/Category.js");
const Coupon = require("../../models/Coupons/Coupon.js");

/* CREATE */
const createCoupon = async (req, res) => {
  try {
    const { userId, name, code, categoryId, desc } = req.body;

    const coupon = Coupon({
      userId,
      name,
      code,
      category: categoryId,
      desc,
    });

    Category.findById({ _id: categoryId });

    await coupon.save();

    res.status(200).json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* READ */
const getSingleCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) return res.status(404).json({ msg: "Coupon does not exist." });

    res.status(200).json({ view: coupon.analytics.view, coupon: coupon });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCoupons = async (req, res) => {
  try {
    const { key } = req.params;
    if (key) {
      let data = await Coupon.find({
        $or: [
          { id: key._id },
          { name: { $regex: key } },
          { code: { $regex: key } },
          { category: { $regex: key } },
        ],
      });
      if (data.length === 0) {
        return res.status(400).json("Not Found!");
      } else {
        return res.status(200).json(data);
      }
    } else {
      const allCoupons = await Coupon.find({}).sort({ $natural: -1 });
      if (allCoupons.length === 0) {
        res.status(404).json("Not found any coupon");
      } else {
        res.status(200).json(allCoupons);
      }
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE */
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon.userId === req.body.userId) {
      await coupon.updateOne({ $set: req.body });
      res.status(200).json("The coupon has been updated");
    } else {
      res.status(403).json("You can update only your coupons");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const likeCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  try {
    if (!coupon.likes.includes(req.body.userId)) {
      await coupon.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("This coupon has been liked");
    } else {
      await coupon.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("This coupon has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

/* DELETE */
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon.userId === req.body.userId) {
      await coupon.deleteOne();
      res.status(200).json("The coupon has been deleted");
    } else {
      res.status(403).json("You can delete only your coupon");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  deleteCoupon,
  likeCoupon,
  updateCoupon,
  getCoupons,
  getSingleCoupon,
  createCoupon,
};
