const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

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

app.use(morgan("tiny"));

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) res.status(404).send();
  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).send();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  const existingName = persons.find((p) => p.name === body.name);

  if (!body.name)
    res.status(404).json({
      error: "name must not be empty",
    });
  if (!body.number)
    res.status(404).json({
      error: "number must not be empty",
    });
  if (existingName)
    res.status(404).json({
      error: "name must be unique",
    });

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  res.json(person);
});

app.get("/info", (req, res) => {
  const length = persons.length;
  const dateAcc = Date();
  res.send(`<p>Phonebooks has info for ${length} people</p> <p>${dateAcc}</p>`);
});

const PORT = 4002;

app.listen(PORT);
console.log(`Server running on port ${PORT}`);