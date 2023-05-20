require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URI = `mongodb+srv://phonebook:${process.env.MONGO_API_KEY}@full-stack-backend.clvv6jm.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
  PORT,
  MONGO_URI,
};
