require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/persons");
app.use(cors());

app.use(express.json());
app.use(express.static("dist"));

app.use(morgan("tiny"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).send();
  });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name)
    res.status(404).json({
      error: "name must not be empty",
    });
  if (!body.number)
    res.status(404).json({
      error: "number must not be empty",
    });

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) =>
      res.status(500).json({ success: false, message: err.message })
    );
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  // const person = {
  //   name: body.name,
  //   number: body.number,
  // };

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res) => {
  const length = persons.length;
  const dateAcc = Date();
  res.send(`<p>Phonebooks has info for ${length} people</p> <p>${dateAcc}</p>`);
});

const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
