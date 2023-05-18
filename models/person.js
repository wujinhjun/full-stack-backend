const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = `mongodb+srv://phonebook:${process.env.MONGO_API_KEY}@full-stack-backend.clvv6jm.mongodb.net/?retryWrites=true&w=majority`;

console.log(`connecting to ${url}`);

mongoose
  .connect(url)
  .then((result) => {
    console.log(`connected to MongoDB`);
  })
  .catch((err) => {
    console.log(`error connecting to MongoDB: ${err.message}`);
  });

const personSchema = new mongoose.Schema({
  number: String,
  name: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
