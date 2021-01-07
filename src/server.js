const express = require("express");
const cors = require("cors");
const listEndPoints = require("express-list-endpoints");
const questionsRoutes = require("./quiz");
// const examResults = require("./examResults");
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/exam/start", questionsRoutes);

console.log(listEndPoints(app));

app.listen(3008, () => {
  console.log("Server is listening at", port);
});
