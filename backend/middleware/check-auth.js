const jwt = require("jsonwebtoken");

// Function which gets executed on incoming requests to autheticate user

module.exports = (req, res, next) => {
  try{
    // Getting token from 'authorization' header
    const token = req.headers.authorization.split(" ")[1];
    // Using JSON webtoken method .verify() to verify the token with the secret hashing string
    // Data stored in constant
    const decodedToken = jwt.verify(token, "this_is_a_secret_string");
    // Email and ID stored in the 'userData' request
    req.userData = {email: decodedToken.email, userID: decodedToken.userID };
    next();
    // Catch all errors
  } catch(error){
    console.log(error);
    res.status(401).json({ message: "You are not authenticated!"})
  }
};
