const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT_ERROR,
  MONGODB_ERROR,
  UNAUATHORIZED,
  DUPLICATE_ERROR
} = require("../utils/errors");

/*

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

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data." });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};
*/

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Hashing the password
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200).send({ message: "User created successfully" })) // Send success message
    .catch((err) => {
      // Check if the error is a duplicate email error
      if (err.code === MONGODB_ERROR) {
        return res.status(DUPLICATE_ERROR).send({ message: "Email already exists" });
      }
      // Handle validation errors
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: "Invalid data." });
      }
      // Handle other errors
      console.error(err);
      return res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server." });
    });
};


const getUserById = (req, res) => {
  const userId = req.user._id; // Retrieve the user ID from the authenticated request

  // const { userId } = req.params;
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

const updateUserProfile = (req, res) => {
  const userId = req.user._id; // Get the ID of the logged-in user
  const { name, avatar } = req.body;

  // Update the user's profile
  User.findByIdAndUpdate(userId, { name, avatar })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(200).send(user); // Send the updated user profile in the response
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: "Invalid data." });
      }
      console.error(err);
      return res.status(DEFAULT_ERROR).send({ message: 'An error occurred while updating user profile' });
    });
};

/*
const login = (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // If user is not found, return error
        return res.status(401).json({ message: "Incorrect email or password" });
      }

      // If user is found, compare passwords
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          // If passwords don't match, return error
          return res
            .status(401)
            .json({ message: "Incorrect email or password" });
        }

        // If passwords match, create JWT token
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        // Send token in response
        res.status(200).json({ token });
      });
    })
    .catch((err) => {
      // Handle other errors
      console.error(err);
      res.status(DEFAULT_ERROR).json({ message: "An error has occurred on the server." });
    });
};
*/

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // Creating a token
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      // Sending the token in the response
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === 'Incorrect email or password') {
        res.status(UNAUATHORIZED).send({ message: 'Incorrect email or password' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = { createUser, getUserById, login, updateUserProfile };
