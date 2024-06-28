const express = require('express');
const {
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getAllStudents,
} = require('../controller/student');
const validateObjectId = require('../middleware/validateObjectId');
const authHandler = require('../middleware/authHandler');

const router = express.Router();

// Use authHandler middleware for routes that require authentication
router.post('/', authHandler, createStudent);
router.put('/:id', authHandler, validateObjectId, updateStudent);
router.delete('/:id', authHandler, validateObjectId, deleteStudent);
router.get('/:id', validateObjectId, getStudentById);
router.get('/', getAllStudents);

module.exports = router;
