const Notification = require("../../models/Notifications/Notification.js");
const { User } = require("../../models/Users/User.js");

/* CREATE */
const createNotif = async (req, res) => {
  try {
    const {
      userId,
      title,
      body,
      channelGroupKey,
      channelKey,
      bigPicture,
      hashtags,
    } = req.body;

    const notification = Notification({
      userId,
      title,
      body,
      channelGroupKey,
      channelKey,
      bigPicture,
      hashtags,
    });

    const user = await User.findById({ _id: userId });
    await user.updateOne({ $push: { notifications: notification._id } });

    await notification.save();

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

/* READ */
const getNotif = async (req, res) => {
  try {
    const { notifId } = req.params;

    const notification = await Notification.findById(notifId);
    if (!notification)
      return res.status(404).json({ msg: "Notification does not exist." });

    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

const getNotifs = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ $natural: -1 });

    if (notifications.length === 0) {
      res.status(404).json("Not found any notification");
    } else {
      res.status(200).json(notifications);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE */
const updateNotif = async (req, res) => {
  try {
    //
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

/* DELETE */
const deleteNotif = async (req, res) => {
  try {
    //
  } catch (err) {
    res.status(500).json({
      status: STATUS.Failed,
      data: err.message,
    });
  }
};

module.exports = {
  createNotif,
  getNotif,
  getNotifs,
  updateNotif,
  deleteNotif,
};
