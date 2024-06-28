const Class = require('../model/class');
const { errorResponse, successResponse } = require('../utils/responseHelper');

// Create a new class
// Create a new class
const createClass = async (req, res, next) => {
    try {
      const { name, year, studentFees } = req.body;
  
      // Validation
      if (!name || !year || !studentFees) {
        return errorResponse(res, 400, 'Missing required fields');
      }
  
      // Create class without assigning teachers and students
      const newClass = new Class({ name, year, studentFees });
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
    const { name, year, teacher, students, studentFees } = req.body;

    // Update class
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      { name, year, teacher, students, studentFees },
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

    // Delete class
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return errorResponse(res, 404, 'Class not found');
    }

    successResponse(res, 200, 'Class deleted successfully', deletedClass);
  } catch (error) {
    next(error);
  }
};

// Get class by ID
const getClassById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get class
    const classData = await Class.findById(id).populate('teacher students');

    if (!classData) {
      return errorResponse(res, 404, 'Class not found');
    }

    successResponse(res, 200, 'Class fetched successfully', classData);
  } catch (error) {
    next(error);
  }
};

// Get all classes
const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find().populate('teacher students');
    successResponse(res, 200, 'Classes fetched successfully', classes);
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
