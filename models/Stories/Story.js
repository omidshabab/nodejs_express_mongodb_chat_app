const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorySchema = Schema(
  {
    //
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", StorySchema);
module.exports = Story;
