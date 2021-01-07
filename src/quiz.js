const express = require("express");
const { check, validationResult } = require("express-validator");
const uniqid = require("uniqid");

// // PATHS
const {
  getQuestions,
  writeQuestions,
  getExamResults,
  writeExamResults,
} = require("./fsUtilities");

const router = express.Router();

// FIELDS VALIDATION
const validation = [
  check("candidateName").exists().withMessage("Candidate name is required!"),
];
//

// GET ALL QUESTIONS
router.get("/", async (req, res, next) => {
  try {
    const questions = await getQuestions();
    res.send(questions);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/", validation, async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send(new Error());
    } else {
      const questions = await getQuestions();
      const examResults = await getExamResults();
      let fiveQuestions = [];
      for (let i = 0; i < 5; i++) {
        const randomQ = Math.floor(Math.random() * (questions.length - 1));
        fiveQuestions.push(questions[randomQ]);
        questions[randomQ] = questions[questions.length - 1];
      }
      console.log(fiveQuestions);
      examResults.push(
        {
          ...req.body,
          _id: uniqid(),
          examDate: new Date(),
          isCompleted: false,
          name: "Admission test",
          TotalDuration: 30,
        },
        fiveQuestions
      );
      await writeExamResults(examResults);
      res.send("Exam sended");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
