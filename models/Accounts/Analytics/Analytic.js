const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnalyticSchema = Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    view: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    click: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    like: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    share: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    reach: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    impression: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    comments: {
      type: Number,
      default: 0,
      data: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  { timestamps: true }
);

const Analytic = mongoose.model("Analytic", AnalyticSchema);
module.exports = Analytic;
