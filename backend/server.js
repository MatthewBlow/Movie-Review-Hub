// Variables

const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");

// Function to make sure sent and recieved ports are valid

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

// Error function checks which error occured, returns the correct response and exits gracefully

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
};

// Function to log listening to requests

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

// Calling normalize port fucntion and setting on express app

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Setting up nodejs server, listeners and starting the server

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

