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
        score: 0,
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

    // FIND CURRENT EXAM FROM THE ROUTE/QUERY
    const currentExam = exams.find((exam) => exam._id === req.params.id);

    // IF THE EXAM IS FOUND THEBN CHECK THE ANSWER FROM THE REQ
    if (currentExam) {
      // READING THE QUESTION THAT COMES FROM THE BODY (AND CLIENT) ACCESSING ITS INDEX
      const question = currentExam.rQuestions[req.body.question];
      // STORING THE VARIABLE "question" TO USE IT FOR STORING "question"
      // READING THE ANSWER THAT COMES FROM THE BODY (AND CLIENT) ACCESSING ITS INDEX
      const answer = question.answers[req.body.answer];
      // CHECKING IF THE ANSWER IS TRUE ACCESSING THE PROP isCorrect
      if (answer.isCorrect === true) {
        // console.log("SCORE");
        currentExam.score = +1; // IF isCorrect IS TRUE THEN UPDATE THE SCORE
      }
      // CREATING A NEW PROP "providedAnswer"
      currentExam.rQuestions[req.body.question].providedAnswer =
        req.body.answer; // ASSIGNING IT TO THE ANSWER THAT COMES FROM THE BODY (AND CLIENT)

      // SENDING THE CURRENT EXAM AS ARRAY OTHERWISE IT WOULD OVERWRITE THE ARRAY IN DATABASE
      await writeExams([currentExam]);
      res.send("Answer sent");
    } else {
      res.send("Exam not found!");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const exams = await getExams();

    const currentExam = exams.find((exam) => exam._id === req.params.id);
    if (currentExam) {
      res.send(currentExam);
    } else {
      res.send("Exam not found");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
