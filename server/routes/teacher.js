const express = require('express');
const {
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  getAllTeachers,
} = require('../controller/teacher');
const validateObjectId = require('../middleware/validateObjectId');
const authHandler = require('../middleware/authHandler');

const router = express.Router();

router.post('/', authHandler, createTeacher);
router.put('/:id', authHandler, validateObjectId, updateTeacher);
router.delete('/:id', authHandler, validateObjectId, deleteTeacher);
router.get('/:id', validateObjectId, getTeacherById);
router.get('/', getAllTeachers);

module.exports = router;
