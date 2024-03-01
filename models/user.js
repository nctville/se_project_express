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

module.exports = mongoose.model("user", userSchema);


