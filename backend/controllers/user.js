const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Javascript module for creating a user

exports.createUser =  (req, res, next) => {
  // Hashing the provided password and applying salt using bcrypt
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Assigning a new user using the User model
      const user = new User({
        email: req.body.email,
        // Assinging the 'hash' promise to the password
        password: hash
    });
    user
    // Mongoose function to save user to database
    .save()
    // Output the new user data
    .then(result => {
      res.status(201).json({
        message: 'User created!',
        result: result
      });
    })
    // Catch any errors
    .catch(err => {
      res.status(500).json({
        message: "Invalid authentication credentials!"
      });
    });
  });
}

// Javascript module for logging in a user

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  // Using .findOne() mongoose feature to find the user email in the db
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log(user);
      // Checking if the promise returns a user
      if(!user)
      {
        // Respond with error status and json response
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      // Assign the user promise to the fetchedUser variable
      fetchedUser = user;
      // Compare the user password input with the DB password
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      // Checks for result, error and json response if not present
      if(!result){
        return res.status(401).json({
          message: "Auth failed"
      });
    }
    // Assigning a JSON Web Token to a constant using the .sign() method
    const token = jwt.sign(
      // Parameters using the email and id from the fetchedUser variable
      { email: fetchedUser.email, userID: fetchedUser._id },
      // The secret string that will be used to validate hashes
      process.env.JWT_KEY,
      {expiresIn: "1h" }
    );
    // Autheticated status response and JSON output
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userID: fetchedUser._id
    });
  })
    // Catch any errors
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
    });
  })
}
