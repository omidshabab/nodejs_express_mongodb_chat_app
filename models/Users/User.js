const mongoose = require("mongoose");
const Joi = require("joi");
const { landinaAccountDB } = require("../../config/database");
const Schema = mongoose.Schema;

const USER_VISIBILITY = {
  PRIVATE: "private",
  PUBLIC: "public",
};

const USER_TYPE = {
  PERSONAL: "personal",
  BUSINESS: "business",
  DEVELOPER: "developer",
  CREATOR: "creator",
  VENDOR: "vendor",
};

const USER_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  VIEWER: "viewer",
};

const CART_TYPE = {
  FONT: "font",
  TEMPLATE: "template",
  PRODUCT: "product",
};

const UserSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      min: 3,
      max: 20,
      lowercase: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      max: 50,
      unique: false,
      validate: {
        validator: (value) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return value.match(re);
        },
        message: "Please enter a valid email address",
      },
    },
    phone: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      min: 6,
      trim: true,
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: {
      type: String,
      enum: USER_TYPE,
      default: USER_TYPE.PERSONAL,
    },
    visible: {
      type: String,
      enum: USER_VISIBILITY,
      default: USER_VISIBILITY.PUBLIC,
    },
    role: {
      type: String,
      enum: USER_ROLE,
    },
    bio: {
      type: String,
      max: 50,
      default: "",
    },
    links: [
      {
        type: Schema.Types.ObjectId,
        ref: "Link",
      },
    ],
    coupons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
    notifications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notifications",
      },
    ],
    chats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chats",
      },
    ],
    contacts: {
      type: Schema.Types.ObjectId,
      ref: "Contacts",
    },
    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: CART_TYPE,
        default: CART_TYPE.PRODUCT,
      },
    ],
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
    },
    deleted: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    archived: [
      {
        type: Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    blocked: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    liked: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    analytics: [
      {
        type: Schema.Types.ObjectId,
        ref: "Analytics",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    backups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Backups",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    validate: true,
  }
);

const User = landinaAccountDB.model("User", UserSchema);

const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255),
    // username: Joi.string().min(3).max(255).required().unique(),
    // email: Joi.string().email().required(),
    token: Joi.string().min(10).max(255),
  });
  return schema.validate(user);
};

module.exports = {
  User,
  validate,
};
