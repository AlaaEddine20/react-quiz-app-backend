const express = require("express");
const { check, validationResult } = require("express-validator");
const uniqid = require("uniqid");

const { getQuestions, writeQuestions } = require("./fsUtilities");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const questions = await getQuestions();

    res.send(questions);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
