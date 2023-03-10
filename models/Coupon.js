const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const COUPON_TYPES = {
  Public: "public",
  Private: "private",
};

const CouponSchema = Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      max: 50,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
      required: true,
    },
    type: {
      type: String,
      enum: COUPON_TYPES,
      default: COUPON_TYPES.Normal,
    },
    likes: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    dislikes: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    links: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "Link",
        },
      ],
    },
    analytics: {
      type: Schema.Types.ObjectId,
      ref: "Analytic",
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    hashtags: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    images: {
      type: Number,
      default: 0,
      data: [
        {
          type: Array,
        },
      ],
    },
    code: {
      type: String,
      required: true,
    },
    locations: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "Location",
        },
      ],
    },
    allowComment: {
      type: Boolean,
      default: true,
    },
    comments: {
      type: Number,
      default: 0,
      allow: Boolean,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
    },
    reports: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "Report",
        },
      ],
    },
    related: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "Coupon",
        },
      ],
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", CouponSchema);
module.exports = Coupon;
