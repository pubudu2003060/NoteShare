import mongoose from "mongoose";

const groupSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    isPrivate: {
      type: Boolean,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    editors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
