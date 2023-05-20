const personRouter = require("express").Router();
const Person = require("../models/person");

personRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

personRouter.post("/", (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "body missing" });
  }

  const number = req.body.number;
  const name = req.body.name;
  if (!name || !number) {
    res.status(406).end();
  }

  const person = new Person({
    name,
    number,
  });

  person
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
});

personRouter.get("/:id", (req, res, next) => {
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

personRouter.delete("/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

personRouter.put("/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
});

module.exports = personRouter;
