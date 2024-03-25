const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const [, , password, name, number] = process.argv;

const url = `mongodb+srv://1slander:${password}@fsopen.jse5dik.mongodb.net/PhoneBookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });
  person.save().then(() => {
    console.log(`Added ${name} ${number} to the phonebook.`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((entries) => {
    console.log("Phonebook entries:");
    entries.forEach((entry) => {
      console.log(entry.name, entry.number);
    });
    mongoose.connection.close();
  });
}
