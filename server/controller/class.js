const Class = require('../model/class');
const Teacher = require('../model/teacher');
const Student = require('../model/student');
const { errorResponse, successResponse } = require('../utils/responseHelper');

// Create a new class
const createClass = async (req, res, next) => {
  try {
    const { name, year, studentFees, maxStudents } = req.body;

    if (!name || !year || !studentFees || !maxStudents) {
      return errorResponse(res, 400, 'Missing required fields');
    }

    const newClass = new Class({ name, year, studentFees, maxStudents });
    await newClass.save();

    successResponse(res, 201, 'Class created successfully', newClass);
  } catch (error) {
    next(error);
  }
};

// Update a class
const updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, year, studentFees, maxStudents } = req.body;

    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { name, year, studentFees, maxStudents },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return errorResponse(res, 404, 'Class not found');
    }

    successResponse(res, 200, 'Class updated successfully', updatedClass);
  } catch (error) {
    next(error);
  }
};

// Delete a class
const deleteClass = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedClass = await Class.findById(id);

    if (!deletedClass) {
      return errorResponse(res, 404, 'Class not found');
    }

    // Remove the class reference from associated teachers
    await Teacher.updateMany(
      { assignedClasses: id },
      { $pull: { assignedClasses: id } }
    );

    // Remove the class reference from associated students
    await Student.updateMany(
      { class: id },
      { $unset: { class: "" } }
    );

    await Class.findByIdAndDelete(id);

    successResponse(res, 200, 'Class deleted successfully', deletedClass);
  } catch (error) {
    next(error);
  }
};

// Get class by ID
const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const classData = await Class.findById(id).populate('teacher students');

    if (!classData) {
      return errorResponse(res, 404, 'Class not found');
    }

    successResponse(res, 200, 'Class fetched successfully', classData);
  } catch (error) {
    next(error);
  }
};

// Get all classes with pagination
const getAllClasses = async (req, res, next) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const classes = await Class.find()
      .populate('teacher')
      .populate('students')
      .skip(skip)
      .limit(Number(limit));

    const totalClasses = await Class.countDocuments();
    const totalPages = Math.ceil(totalClasses / limit);

    successResponse(res, 200, 'Classes fetched successfully', {
      classes,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  updateClass,
  deleteClass,
  getClassById,
  getAllClasses,
};
