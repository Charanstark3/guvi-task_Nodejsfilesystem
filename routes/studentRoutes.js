const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// 2. Create Student
router.post('/create', async (req, res) => {
  const student = new Student(req.body);
  try {
    await student.save();
    res.status(201).send(student);
  } catch (e) {
    res.status(400).send(e);
  }
});

// 4. Assign/Change Mentor for a particular student
router.post('/assign-mentor/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { mentorId } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).send('Student not found');

    student.mentor = mentorId;
    await student.save();
    res.send(student);
  } catch (e) {
    res.status(500).send(e);
  }
});

// 6. Show previously assigned mentor
router.get('/:studentId/mentor', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate('mentor');
    if (!student) return res.status(404).send('Student not found');
    res.send(student.mentor);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
