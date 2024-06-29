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
    teacher: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    }],
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
    maxStudents: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

classSchema.virtual('currentStudentsCount').get(function() {
  return this.students.length;
});

classSchema.path('students').validate(function(value) {
  return this.students.length <= this.maxStudents;
}, 'Maximum student limit reached for this class.');

const Class = mongoose.model("Class", classSchema);
module.exports = Class;
