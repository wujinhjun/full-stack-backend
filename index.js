const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const tranArrayToObj = (arr) =>
  arr.reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
  }, {});

const tranObjToArray = (obj) => Reflect.ownKeys(obj).map((item) => obj[item]);

const isExist = (name) =>
  persons.filter((item) => item.name === name).length > 0;

const personsObj = tranArrayToObj(persons);

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
  res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const number = req.body.number;
  const name = req.body.name;
  if (!name || !number) {
    res.status(406).end();
  }

  if (isExist(name)) {
    res.status(409).end({ error: "name must be unique" });
  }

  const id = Math.floor(Math.random() * 100000);
  personsObj[id] = { id, name, number };
  persons = tranObjToArray(personsObj);
  res.json(personsObj[id]).status(201).end();
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const data = personsObj[id];
  if (data) {
    res.json(data);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const data = personsObj[id];
  if (data) {
    delete personsObj[id];
    persons = tranObjToArray(personsObj);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
