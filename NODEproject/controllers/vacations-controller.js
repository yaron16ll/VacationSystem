const vacationsLogic = require("../logic/vacations-logic");
const express = require("express");
const usersCache = require("../dao/cache-module");

const router = express.Router();

//GET ALL VACATIONS
// GET http://localhost:3000/vacations/all
router.get("/all", async (request, response, next) => {
  try {

    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);

    let allVacations = await vacationsLogic.getAllVacations(userData);

    console.log(allVacations)
    response.json(allVacations);
  }
  catch (error) {
    // console.log(error);
    return next(error);
  }
});

//ADD VACATION
//  POST http://localhost:3000/vacations
router.post("/", async (request, response, next) => {
  // Extracting the JSON from the packet's BODY
  let vacation = request.body;

  try {

    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);

    let allVacations = await vacationsLogic.addVacation(vacation, userData.userType)
    response.json(allVacations);

  }
  catch (error) {
    // console.log(error);
    return next(error);
  }
});


//DELETE VACATION
//  DELETE http://localhost:3000/vacations/vacationId
router.delete("/:vacationId", async (request, response, next) => {

  let vacationId = request.params.vacationId;

  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);

    await vacationsLogic.deleteVacation(vacationId, userData.userType)
    response.json();

  }
  catch (error) {
    // console.log(error);
    return next(error);
  }
});


//UPDATE VACATION
//  UPDATE http://localhost:3000/vacations
router.put("/", async (request, response, next) => {

  // Extracting the JSON from the packet's BODY
  let vacation = request.body;
  console.log(vacation)
  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);

    await vacationsLogic.updateVacation(vacation, userData.userType)
    response.json();

  }
  catch (error) {
    // console.log(error);
    return next(error);
  }
});


// UPLOAD AN IMAGE
// // POST http://localhost:3000/vacations/uploadImageFile
router.post("/uploadImageFile", async (request, response, next) => {
  // Extracting from the request the image file that's supposed to be uploaded
  const file = request.files.image;
  console.log(file)
  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);

    let successfulUploadResponse = await vacationsLogic.uploadVacationImage(file, userData.userType);

    response.json(successfulUploadResponse);
  } catch (error) {
    return next(error);
  }
});

//GET ALL FOLLOWING VACATIONS
//  GET  http://localhost:3000/vacations/allFollowedVacations
router.get("/allFollowedVacations", async (request, response, next) => {


  try {
    // In order to succeed, we must extract the user's userData from the cache
    let authorizationString = request.headers["authorization"];
    // Removing the bearer prefix, leaving the clean token
    let token = authorizationString.substring("Bearer ".length);
    let userData = usersCache.get(token);

    let allFollowedVacations = await vacationsLogic.getAllFollowedVacations(userData.userType)
    response.json(allFollowedVacations);

  }
  catch (error) {
    // console.log(error);
    return next(error);
  }
});


module.exports = router;
