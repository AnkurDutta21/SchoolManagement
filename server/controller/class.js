const Class = require('../model/class');
const Teacher = require('../model/teacher');
const Student = require('../model/student');
const { errorResponse, successResponse } = require('../utils/responseHelper');
const { FEILDS_MISSING, CLASS_CREATED, CLASS_NOT_FOUND, CLASS_UPDATED, CLASS_DELETED, CLASS_FETCHED } = require('../utils/messageHelper');

// Create a new class
const createClass = async (req, res, next) => {
  try {
    const { name, year, studentFees, maxStudents } = req.body;

    if (!name || !year || !studentFees || !maxStudents) {
      return errorResponse(res, 400,FEILDS_MISSING);
    }

    const newClass = new Class({ name, year, studentFees, maxStudents });
    await newClass.save();

    successResponse(res, 201,CLASS_CREATED, newClass);
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
      return errorResponse(res, 404, CLASS_NOT_FOUND);
    }

    successResponse(res, 200, CLASS_UPDATED, updatedClass);
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
      return errorResponse(res, 404, CLASS_NOT_FOUND);
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

    successResponse(res, 200,CLASS_DELETED , deletedClass);
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
      return errorResponse(res, 404, CLASS_NOT_FOUND);
    }

    successResponse(res, 200,CLASS_FETCHED , classData);
  } catch (error) {
    next(error);
  }
};

// Get all classes with pagination
const getAllClasses = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, className = '', sortBy = 'year', order = 'asc' } = req.query;
    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    // Build the query object
    const query = className ? { name: new RegExp(className, 'i') } : {};

    const classes = await Class.find(query)
      .populate('teacher')
      .populate('students')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const totalClasses = await Class.countDocuments(query);
    const totalPages = Math.ceil(totalClasses / limit);

    successResponse(res, 200, CLASS_FETCHED, {
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
