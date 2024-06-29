const express = require('express');
const router = express.Router();
const Teacher = require('../model/teacher');
const Student = require('../model/student');
const Class = require('../model/class');

// Get monthly/yearly salary expenses and fees income
const getFinancials = async (req, res) => {
  const { period, year, month } = req.query;
  try {
    const teachers = await Teacher.find();
    const students = await Student.find();

    let totalSalary = 0;
    let totalFees = 0;

    teachers.forEach(teacher => {
      totalSalary += teacher.salary;
    });

    students.forEach(student => {
      totalFees += student.feesPaid;
    });
     
    const profit = totalFees - totalSalary

    res.json({
      totalSalary,
      totalFees,
      profit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// gender distribution
const getGenderDistribution = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id).populate('students');
    
    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Initialize counts
    let maleCount = 0;
    let femaleCount = 0;

    // Count genders
    cls.students.forEach(student => {
      const genderLower = student.gender.toLowerCase();
      if (genderLower === 'male') {
        maleCount++;
      } else if (genderLower === 'female') {
        femaleCount++;
      }
    });

    res.json({ maleCount, femaleCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {getFinancials,getGenderDistribution};