const followingsLogic = require("../logic/followings-logic");
const express = require("express");
const usersCache = require("../dao/cache-module");

const router = express.Router();

//ADD NEW FOLLOWING
// POST http://localhost:3000/followings 
router.post("/", async (request, response, next) => {
    let vacation = request.body

    try {
        let authorizationString = request.headers["authorization"];
        // Removing the bearer prefix, leaving the clean token
        let token = authorizationString.substring("Bearer ".length);
        let userData = usersCache.get(token);

        await followingsLogic.addFollowing(userData.userId, vacation.vacationId)
        response.json();
    }

    catch (error) {
        // console.log(error);
        return next(error);
    }
});

//DELETE FOLLOWING
// DELETE http://localhost:3000/followings?vacationId=?
router.delete("/", async (request, response, next) => {

    let vacationId = request.query.vacationId

    try {
        let authorizationString = request.headers["authorization"];
        // Removing the bearer prefix, leaving the clean token
        let token = authorizationString.substring("Bearer ".length);
        let userData = usersCache.get(token);

        await followingsLogic.deleteFollowing(userData.userId, vacationId)
        response.json();
    }
    catch (error) {
        // console.log(error);
        return next(error);
    }
});


//DELETE ALL FOLLOWINGS OF VACATION
// DELETE http://localhost:3000/followings/allFollowings?vacationId=?
router.delete("/allFollowings", async (request, response, next) => {
    console.log(2542)
    let vacationId = request.query.vacationId

    try {
        await followingsLogic.deleteAllfollowingsByVacationId(vacationId)
        response.json();
    }
    catch (error) {
        // console.log(error);
        return next(error);
    }
});




module.exports = router;
