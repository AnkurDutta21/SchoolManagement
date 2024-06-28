const Teacher = require('../model/teacher');
const { errorResponse, successResponse } = require('../utils/responseHelper');

// Create a new teacher
const createTeacher = async (req, res, next) => {
  try {
    const { name, gender, dob, contactDetails, salary, assignedClass } = req.body;

    // Validation
    if (!name || !gender || !dob || !contactDetails || !salary) {
      return errorResponse(res, 400, 'Missing required fields');
    }

    const newTeacher = new Teacher({ name, gender, dob, contactDetails, salary, assignedClass });
    await newTeacher.save();

    successResponse(res, 201, 'Teacher created successfully', newTeacher);
  } catch (error) {
    next(error);
  }
};

// Update a teacher
const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, gender, dob, contactDetails, salary, assignedClass } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { name, gender, dob, contactDetails, salary, assignedClass },
      { new: true, runValidators: true }
    );

    if (!updatedTeacher) {
      return errorResponse(res, 404, 'Teacher not found');
    }

    successResponse(res, 200, 'Teacher updated successfully', updatedTeacher);
  } catch (error) {
    next(error);
  }
};

// Delete a teacher
const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return errorResponse(res, 404, 'Teacher not found');
    }

    successResponse(res, 200, 'Teacher deleted successfully', deletedTeacher);
  } catch (error) {
    next(error);
  }
};

// Get teacher by ID
const getTeacherById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id).populate('assignedClass');

    if (!teacher) {
      return errorResponse(res, 404, 'Teacher not found');
    }

    successResponse(res, 200, 'Teacher fetched successfully', teacher);
  } catch (error) {
    next(error);
  }
};

// Get all teachers with pagination
const getAllTeachers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const teachers = await Teacher.find().populate('assignedClass').skip(skip).limit(Number(limit));

    const totalTeachers = await Teacher.countDocuments();
    const totalPages = Math.ceil(totalTeachers / limit);

    successResponse(res, 200, 'Teachers fetched successfully', {
      teachers,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  getAllTeachers,
};
