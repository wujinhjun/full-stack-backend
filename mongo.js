const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://phonebook:${password}@full-stack-backend.clvv6jm.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  number: String,
  name: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv[3] && process.argv[4]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}

// const person = new Person({
//   id: "111",
//   name: "hello",
//   number: "666666",
// });

// person.save().then((result) => {
//   console.log("person saved!");
//   mongoose.connection.close();
// });

// Person.find({}).then((result) => {
//   result.forEach((person) => {
//     console.log(person);
//   });

//   mongoose.connection.close();
// });
