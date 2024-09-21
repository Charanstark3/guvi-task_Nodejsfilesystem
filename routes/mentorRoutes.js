const express = require('express');
const router = express.Router();
const Mentor = require('../models/menter');
const Student = require('../models/student');

// Create Mentor
router.post('/create', async (req, res) => {
  const mentor = new Mentor(req.body);
  try {
    await mentor.save();
    res.status(201).send(mentor);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Assign Students to Mentor
router.post('/assign-students/:mentorId', async (req, res) => {
  const { mentorId } = req.params;
  const { studentIds } = req.body; // array of student IDs

  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).send('Mentor not found');

    // Update each student with mentorId
    await Student.updateMany({ _id: { $in: studentIds } }, { mentor: mentorId });
    mentor.students.push(...studentIds);
    await mentor.save();

    res.send(mentor);
  } catch (e) {
    res.status(500).send(e);
  }
});


router.get('/:mentorId/students', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate('students');
    if (!mentor) return res.status(404).send('Mentor not found');
    res.send(mentor.students);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
