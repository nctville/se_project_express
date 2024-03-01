const User = require("../models/user");
const bcrypt = require('bcrypt');

const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR, MONGODB_ERROR } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

// const createUser = (req, res) => {
//   const { name, avatar } = req.body;
//   User.create({ name, avatar })
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "ValidationError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid data." });
//       }
//       return res
//         .status(DEFAULT_ERROR)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Hashing the password
  bcrypt.hash(password, 10)
    .then(hash => {
      // Creating the user with hashed password
      return User.create({
        name: name,
        avatar: avatar,
        email: email,
        password: hash
      });
    })
    .then((user) => {
      // Send the created user in the response
      res.status(200).send(user);
    })
    .catch((err) => {
      // Check if the error is a duplicate email error
      if (err.code === MONGODB_ERROR) {
        return res.status(BAD_REQUEST).send({ message: "Email already exists" });
      }
      // Handle other errors
      console.error(err);
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server." });
    });
};


const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUserById };
