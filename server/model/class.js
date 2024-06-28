const mongoose = require("mongoose");
const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    year: {
      type: Number,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    studentFees: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);


const Class = mongoose.model("Class", classSchema);
module.exports = Class;
