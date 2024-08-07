const Class = require("../model/class");
const Student = require("../model/student");
const { FEILDS_MISSING, CLASS_NOT_FOUND, CLASS_MAXED, STUDENT_CREATED, STUDENT_NOT_FOUND, NEW_CLASS_NOT_FOUND, STUDENT_UPDATED, STUDENT_DELETED, STUDENT_FETCHED } = require("../utils/messageHelper");
const { errorResponse, successResponse } = require("../utils/responseHelper");

const createStudent = async (req, res, next) => {
  try {
    const {
      name,
      gender,
      dob,
      contactDetails,
      feesPaid,
      class: classId,
    } = req.body;

    // Validation
    if (!name || !gender || !dob || !contactDetails || !feesPaid || !classId) {
      return errorResponse(res, 400, FEILDS_MISSING);
    }

    // Check class capacity
    const targetClass = await Class.findById(classId);
    if (!targetClass) {
      return errorResponse(res, 404, CLASS_NOT_FOUND);
    }
    if (targetClass.students.length >= targetClass.maxStudents) {
      return errorResponse(res, 400, CLASS_MAXED);
    }

    // Create student
    const newStudent = new Student({
      name,
      gender,
      dob,
      contactDetails,
      feesPaid,
      class: classId,
    });
    await newStudent.save();

    // Add student reference to class
    targetClass.students.push(newStudent._id);
    await targetClass.save();

    successResponse(res, 201,STUDENT_CREATED , newStudent);
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
      class: newClassId,
    } = req.body;

    const currentStudent = await Student.findById(id);

    if (!currentStudent) {
      return errorResponse(res, 404, STUDENT_NOT_FOUND);
    }

    // If class is being updated, check new class capacity
    if (newClassId && newClassId.toString() !== currentStudent.class.toString()) {
      const newClass = await Class.findById(newClassId);
      if (!newClass) {
        return errorResponse(res, 404,NEW_CLASS_NOT_FOUND );
      }
      if (newClass.students.length >= newClass.maxStudents) {
        return errorResponse(res, 400, CLASS_MAXED);
      }

      // Remove student reference from old class
      await Class.findByIdAndUpdate(currentStudent.class, {
        $pull: { students: id },
      });

      // Add student reference to new class
      newClass.students.push(id);
      await newClass.save();

      currentStudent.class = newClassId;
    }

    // Update other fields
    currentStudent.name = name;
    currentStudent.gender = gender;
    currentStudent.dob = dob;
    currentStudent.contactDetails = contactDetails;
    currentStudent.feesPaid = feesPaid;

    const updatedStudent = await currentStudent.save();

    successResponse(res, 200, STUDENT_UPDATED, updatedStudent);
  } catch (error) {
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return errorResponse(res, 404, STUDENT_NOT_FOUND);
    }

    // Remove student from class
    await Class.findByIdAndUpdate(student.class, {
      $pull: { students: id },
    });

    // Delete student
    await student.deleteOne();

    successResponse(res, 200, STUDENT_DELETED, student);
  } catch (error) {
    next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get student
    const student = await Student.findById(id).populate("class");

    if (!student) {
      return errorResponse(res, 404, STUDENT_NOT_FOUND);
    }

    successResponse(res, 200,STUDENT_FETCHED , student);
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, studentName = '', sortBy = 'name', order = 'asc', gender = '' } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    if (studentName) {
      query.name = { $regex: studentName, $options: 'i' };
    }

    if (gender) {
      query.gender = gender;
    }

    const students = await Student.find(query)
      .populate("class")
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalStudents = await Student.countDocuments(query);
    const totalPages = Math.ceil(totalStudents / limit);

    successResponse(res, 200,STUDENT_FETCHED, {
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
