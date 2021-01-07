const express = require("express");
const { check, validationResult } = require("express-validator");
const uniqid = require("uniqid");

// // PATHS
const { getExams, writeExams, getQuestions } = require("./fsUtilities");

const router = express.Router();

// FIELDS VALIDATION
const validation = [
  check("candidateName").exists().withMessage("Candidate name is required!"),
];
//

router.post("/start", validation, async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(new Error());
    } else {
      const questions = await getQuestions();
      const exams = await getExams();
      let rQuestions = [];
      for (let i = 0; i < 5; i++) {
        const randomQ = Math.floor(Math.random() * (questions.length - 1));
        rQuestions.push(questions[randomQ]);
        questions[randomQ] = questions[questions.length - 1];
      }

      exams.push({
        ...req.body,
        _id: uniqid(),
        examDate: new Date(),
        isCompleted: false,
        name: "Admission test",
        rQuestions,
      });
      await writeExams(exams);
      res.send("Exam sended");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/:id/answer", async (req, res, next) => {
  try {
    const exams = await getExams();

    const examIndex = exams.findIndex((exam) => exam._id === req.params.id);

    if (examIndex !== -1) {
      exams[examIndex].rQuestions[req.body.question].providedAnswer =
        req.body.answer;

      await writeExams(exams);
      res.send("Answer sent");
    } else {
      res.send("Exam not found!");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
