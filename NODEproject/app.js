const express = require("express");
const cors = require("cors");
const loginFilter = require("./middleware/login-filter");
const fs = require("fs");

// using a middleware which helps managing the file upload
const fileUpload = require("express-fileupload");
const vacationsController = require("./controllers/vacations-controller");
const usersController = require("./controllers/users-controller");

const followingsController = require("./controllers/followings-controller");
const destinationsController = require("./controllers/destinations-controller");
const errorHandler = require("./errors/error-handler");

// Declaring a handler for express()
const server = express();


if (!fs.existsSync("./uploads")) {
  // Must create "/uploads" folder if it does not exist.
  fs.mkdirSync("./uploads");
}

// Registering to Middlewares:

// Enables other domains to connect to my server
server.use(cors());

// Extract the JSON from the body and create request.body object containing it:
server.use(express.json());

// A middleware which filters requests require to be logged in or not
server.use(loginFilter());

// Registering the file upload middleware
server.use(fileUpload());



//request that ends with /uploads, serve the uploads folder
server.use("/uploads", express.static("uploads"));

server.use("/users", usersController);
server.use("/destinations", destinationsController);
server.use("/followings", followingsController);
server.use("/vacations", vacationsController);

server.use(errorHandler);


server.listen(3000, () => console.log("Listening on http://localhost:3000"));
