const Class = require('../model/class');
const Teacher = require('../model/teacher');
const { FEILDS_MISSING, TEACHER_CREATED, TEACHER_NOT_FOUND, TEACHER_UPDATED, TEACHER_DELETED, TEACHER_FETCHED } = require('../utils/messageHelper');
const { errorResponse, successResponse } = require('../utils/responseHelper');

const createTeacher = async (req, res, next) => {
  try {
    const { name, gender, dob, contactDetails, salary, assignedClass } = req.body;

    if (!name || !gender || !dob || !contactDetails || !salary || !Array.isArray(assignedClass) || assignedClass.length === 0) {
      return errorResponse(res, 400, FEILDS_MISSING);
    }
    const newTeacher = new Teacher({ name, gender, dob, contactDetails, salary, assignedClass });
    await newTeacher.save();

    // Update each class with the new teacher reference 
    for (const classId of assignedClass) {
      await Class.findByIdAndUpdate(classId, {
        $push: { teacher: newTeacher._id },
      });
    }

    successResponse(res, 201, TEACHER_CREATED, newTeacher);
  } catch (error) { 
    next(error);
  }
};

// Update a teacher
const updateTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, gender, dob, contactDetails, salary, assignedClass } = req.body;

    const currentTeacher = await Teacher.findById(id);

    if (!currentTeacher) {
      return errorResponse(res, 404, TEACHER_NOT_FOUND);
    }

    const oldClassIds = currentTeacher.assignedClass || [];

    // Remove teacher from old classes 
    if (Array.isArray(assignedClass) && assignedClass.length) {
      // Remove teacher reference from old classes
      for (const oldClassId of oldClassIds) {
        if (!assignedClass.includes(oldClassId.toString())) {
          await Class.findByIdAndUpdate(oldClassId, {
            $pull: { teacher: id },
          });
        }
      }

      // Add teacher reference to new classes
      for (const newClassId of assignedClass) {
        if (!oldClassIds.includes(newClassId.toString())) {
          await Class.findByIdAndUpdate(newClassId, {
            $push: { teacher: id },
          });
        }
      }
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { name, gender, dob, contactDetails, salary, assignedClass },
      { new: true, runValidators: true }
    );

    successResponse(res, 200, TEACHER_UPDATED, updatedTeacher);
  } catch (error) {
    next(error);
  }
};

// Delete a teacher
const deleteTeacher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return errorResponse(res, 404, TEACHER_NOT_FOUND);
    }

    // Remove teacher from all assigned classes
    for (const classId of teacher.assignedClass) {
      await Class.findByIdAndUpdate(classId, {
        $pull: { teacher: id },
      });
    }

    // Delete teacher
    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    successResponse(res, 200, TEACHER_DELETED, deletedTeacher);
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
      return errorResponse(res, 404, TEACHER_NOT_FOUND);
    }

    successResponse(res, 200, TEACHER_FETCHED, teacher);
  } catch (error) {
    next(error);
  }
};

// Get all teachers with pagination
const getAllTeachers = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, teacherName = '', sortBy = 'name', order = 'asc', gender = '' } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (teacherName) {
      query.name = { $regex: teacherName, $options: 'i' };
    }

    if (gender) {
      query.gender = gender;
    }

    const teachers = await Teacher.find(query)
      .populate('assignedClass')
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalTeachers = await Teacher.countDocuments(query);
    const totalPages = Math.ceil(totalTeachers / limit);

    successResponse(res, 200, TEACHER_FETCHED, {
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
