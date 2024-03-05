const bcrypt = require("bcrypt");

const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,

  },

  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },

  email: {
    type: String,
    required: true,
    unique: true, // Ensure email uniqueness
    validate: {
      validator: validator.isEmail, // Validate email format
      message: "Invalid email format",
    },
  },

  password: {
    type: String,
    required: true,
    select: false, // Password field is not included in query results by default
  }

});


userSchema.statics.findUserByCredentials = function findUserByCredentials (email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Incorrect email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Incorrect email or password'));
          }

          return user; // now user is available
        });
    });
};

module.exports = mongoose.model("user", userSchema);


