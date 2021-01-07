const { readJSON, writeJSON } = require("fs-extra");
const { join } = require("path");

const questionsPath = join(__dirname, "questions.json");
const examsPath = join(__dirname, "./exams.json");
const readDB = async (filePath) => {
  try {
    const fileJson = await readJSON(filePath);
    console.log(fileJson);
    return fileJson;
  } catch (error) {
    throw new Error(error);
  }
};

const writeDB = async (filePath, fileContent) => {
  try {
    await writeJSON(filePath, fileContent);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getQuestions: async () => readDB(questionsPath),
  writeQuestions: async (questionsData) =>
    writeDB(questionsPath, questionsData),
  getExams: async () => readDB(examsPath),
  writeExams: async (examData) => writeDB(examsPath, examData),
};
