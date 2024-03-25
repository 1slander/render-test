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
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).send();
});

app.post("/api/persons", (req, res) => {
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
    .catch((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((err) => console.log("Couldnt create new person"));
});

app.get("/info", (req, res) => {
  const length = persons.length;
  const dateAcc = Date();
  res.send(`<p>Phonebooks has info for ${length} people</p> <p>${dateAcc}</p>`);
});

const PORT = process.env.PORT;

app.listen(PORT);
console.log(`Server running on port ${PORT}`);
