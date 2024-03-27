const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const [, , password, name, number] = process.argv;

const url = process.env.MONGODB_URI;

console.log("connecting to:", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("error connecting to MongoDB", err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{5}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number, number must be i.e xxx-xxxxx`,
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);

// if (name && number) {
//   const person = new Person({
//     name,
//     number,
//   });
//   person.save().then(() => {
//     console.log(`Added ${name} ${number} to the phonebook.`);
//     mongoose.connection.close();
//   });
// } else {
//   Person.find({}).then((entries) => {
//     console.log("Phonebook entries:");
//     entries.forEach((entry) => {
//       console.log(entry.name, entry.number);
//     });
//     mongoose.connection.close();
//   });
// }
