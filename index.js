const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Person = require("./models/person");

// initialize the express
const app = express();

// config the middle ware to record the log token
morgan.token("body", (req, res) => JSON.stringify(req.body) ?? "");

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());
app.use(express.static("build"));
app.use(errorHandler);

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

const isExist = (name) =>
  persons.filter((item) => item.name === name).length > 0;

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

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "body missing" });
  }

  const number = req.body.number;
  const name = req.body.name;
  if (!name || !number) {
    res.status(406).end();
  }

  if (isExist(name)) {
    res.status(409).end({ error: "name must be unique" });
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    res.json(result);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
