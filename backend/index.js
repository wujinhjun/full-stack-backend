const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const config = require("./utils/config");
const logger = require("./utils/logger");
const personRouter = require("./controllers/persons");
const middleware = require("./utils/middleware");

mongoose.set("strictQuery", false);
logger.info("connecting to", config.MONGO_URI);

mongoose
  .connect(config.MONGO_URI)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

// initialize the express
const app = express();

// config the middle ware to record the log token
morgan.token("body", (req, res) => JSON.stringify(req.body) ?? "");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("build"));

const weeks = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const padding = (num, size) => {
  const s = num.toString();
  console.log(s);
  return s.padStart(size, "0");
};

const offsetCalc = (time) => {
  const offsetHours = time.getTimezoneOffset() / 60;
  const sign = offsetHours > 0 ? "-" : "+";
  const hours = Math.abs(offsetHours);
  return `GMT${sign}${padding(hours, 2) + padding(0, 2)}`;
};

let persons = [];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  const time = new Date();
  const result =
    `
    <p>Phone has info for ${persons.length} people</p>\n` +
    `${weeks[time.getDay() - 1]} ` +
    `${months[time.getMonth()]} ${time.getDate()} ${time.getFullYear()} ` +
    `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} ` +
    `${offsetCalc(time)} ` +
    `(${Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone.split("/")
      .join(" ")} Standard Time)`;
  res.send(result);
});

app.use("/api/persons", personRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
