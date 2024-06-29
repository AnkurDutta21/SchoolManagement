const Class = require("../model/class");
const Student = require("../model/student");
const { errorResponse, successResponse } = require("../utils/responseHelper");

const createStudent = async (req, res, next) => {
  try {
    const {
      name,
      gender,
      dob,
      contactDetails,
      feesPaid,
      class: classIds, // Assuming you receive an array of class IDs
    } = req.body;

    // Validation
    if (!name || !gender || !dob || !contactDetails || !feesPaid) {
      return errorResponse(res, 400, "Missing required fields");
    }

    // Create student
    const newStudent = new Student({
      name,
      gender,
      dob,
      contactDetails,
      feesPaid,
      class: classIds,
    });
    await newStudent.save();

    // Add student reference to each class
    for (const classId of classIds) {
      await Class.findByIdAndUpdate(classId, {
        $push: { students: newStudent._id },
      });
    }

    successResponse(res, 201, "Student created successfully", newStudent);
  } catch (error) {
    next(error);
  }
};


const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      gender,
      dob,
      contactDetails,
      feesPaid,
      class: newClassIds,
    } = req.body;

    const currentStudent = await Student.findById(id);

    if (!currentStudent) {
      return errorResponse(res, 404, "Student not found");
    }

    // Remove student from old classes
    if (newClassIds && newClassIds.length) {
      const oldClassIds = currentStudent.classes;

      // Remove student reference from classes 
      for (const oldClassId of oldClassIds) {
        if (!newClassIds.includes(oldClassId.toString())) {
          await Class.findByIdAndUpdate(oldClassId, {
            $pull: { students: id },
          });
        }
      }

      // Add student reference to new classes
      for (const newClassId of newClassIds) {
        if (!oldClassIds.includes(newClassId.toString())) {
          await Class.findByIdAndUpdate(newClassId, {
            $push: { students: id },
          });
        }
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, gender, dob, contactDetails, feesPaid, class: newClassIds },
      { new: true, runValidators: true }
    );

    successResponse(res, 200, "Student updated successfully", updatedStudent);
  } catch (error) {
    next(error);
  }
};


const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }

    // Remove student from each class
    for (const classId of student.class) {
      await Class.findByIdAndUpdate(classId, {
        $pull: { students: id },
      });
    }

    // Delete student
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return errorResponse(res, 404, "Student not found");
    }

    successResponse(res, 200, "Student deleted successfully", deletedStudent);
  } catch (error) {
    next(error);
  }
};


// Get student by ID
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get student
    const student = await Student.findById(id).populate("class");

    if (!student) {
      return errorResponse(res, 404, "Student not found");
    }

    successResponse(res, 200, "Student fetched successfully", student);
  } catch (error) {
    next(error);
  }
};

// Get all students with pagination
const getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get students with pagination
    const students = await Student.find()
      .populate("class")
      .skip(skip)
      .limit(Number(limit));

    const totalStudents = await Student.countDocuments();
    const totalPages = Math.ceil(totalStudents / limit);

    successResponse(res, 200, "Students fetched successfully", {
      students,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getAllStudents,
};
