const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// This is the User model using the mongoose.Schema for struturing the data

const userSchema = mongoose.Schema({
  email : { type: String, required: true, unique: true },
  password: { type: String, required: true}
});

// Adding mongoose-unique-validator that will be used to verify unique emails
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
