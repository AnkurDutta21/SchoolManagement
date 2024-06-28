const express = require('express');
const {
  createClass,
  updateClass,
  deleteClass,
  getClassById,
  getAllClasses,
} = require('../controller/class');
const validateObjectId = require('../middleware/validateObjectId');
const authHandler = require('../middleware/authHandler');

const router = express.Router();

router.post('/',authHandler, createClass);
router.put('/:id',authHandler, validateObjectId, updateClass);
router.delete('/:id',authHandler, validateObjectId, deleteClass);
router.get('/:id',authHandler, validateObjectId, getClassById);
router.get('/',authHandler, getAllClasses);

module.exports = router;
