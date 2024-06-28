const Student = require('../model/student');
const { errorResponse, successResponse } = require('../utils/responseHelper');

// Create a new student
const createStudent = async (req, res, next) => {
  try {
    const { name, gender, dob, contactDetails, feesPaid, class: classId } = req.body;

    // Validation
    if (!name || !gender || !dob || !contactDetails || !feesPaid) {
      return errorResponse(res, 400, 'Missing required fields');
    }

    // Create student
    const newStudent = new Student({ name, gender, dob, contactDetails, feesPaid, class: classId });
    await newStudent.save();

    successResponse(res, 201, 'Student created successfully', newStudent);
  } catch (error) {
    next(error);
  }
};

// Update a student
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, gender, dob, contactDetails, feesPaid, class: classId } = req.body;

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, gender, dob, contactDetails, feesPaid, class: classId },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return errorResponse(res, 404, 'Student not found');
    }

    successResponse(res, 200, 'Student updated successfully', updatedStudent);
  } catch (error) {
    next(error);
  }
};

// Delete a student
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete student
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return errorResponse(res, 404, 'Student not found');
    }

    successResponse(res, 200, 'Student deleted successfully', deletedStudent);
  } catch (error) {
    next(error);
  }
};

// Get student by ID
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get student
    const student = await Student.findById(id).populate('class');

    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    successResponse(res, 200, 'Student fetched successfully', student);
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
    const students = await Student.find().populate('class').skip(skip).limit(Number(limit));

    const totalStudents = await Student.countDocuments();
    const totalPages = Math.ceil(totalStudents / limit);

    successResponse(res, 200, 'Students fetched successfully', {
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
