const mongoose = require("mongoose");
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  contactDetails: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  assignedClass: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  ],
});

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
