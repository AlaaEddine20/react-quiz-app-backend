const express = require("express");
const cors = require("cors");
const listEndPoints = require("express-list-endpoints");
const questionsRoutes = require("./questions");
const examsRoutes = require("./exams");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/quesions", questionsRoutes);
app.use("/exams", examsRoutes);
console.log(listEndPoints(app));

app.listen(3008, () => {
  console.log("Server is listening at", port);
});
