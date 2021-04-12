let usersLogic = require("../logic/users-logic");
const express = require("express");


const router = express.Router();



// CREATE  USER/REGISTER
// POST http://localhost:3000/users/register
router.post("/register", async (request, response, next) => {

    // Extracting the JSON from the packet's BODY
    let user = request.body;

    try {
        await usersLogic.addUser(user);
        response.json();
    } catch (error) {
        // console.log(error);
        return next(error);
    }
});


// LOGIN
// POST http://localhost:3000/users/login
router.post("/login", async (request, response, next) => {

    // Extracting the JSON from the packet's BODY
    let user = request.body;

    try {
        let successfullLoginData = await usersLogic.login(user);
        response.json(successfullLoginData);
    } catch (error) {
        // console.log(error);
        return next(error);
    }
});

// DISCONNECT
// POST http://localhost:3000/users/disconnect
router.post("/disconnect", async (request, response, next) => {

    // Extracting the JSON from the packet's BODY
    let userToken = request.body;
    try {
        await usersLogic.disconnect(userToken);
        response.json();

    } catch (error) {
        // console.log(error);
        return next(error);
    }
});


module.exports = router;