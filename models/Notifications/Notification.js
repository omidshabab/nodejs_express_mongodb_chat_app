const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    channelGroupKey: {
      type: String,
      required: false,
    },
    channelKey: {
      type: String,
      required: true,
    },
    bigPicture: {
      type: String,
      required: false,
    },
    hashtags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hashtag",
      },
    ],
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
