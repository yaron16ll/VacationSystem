const followingsDao = require("../dao/followings-dao");
const vacationsLogic = require("../logic/vacations-logic");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");


async function deleteFollowing(userId, vacationId) {
    await followingsDao.deleteFollowing(userId, vacationId)
    await vacationsLogic.updateVacationFollowingsAmount(vacationId)
}



async function addFollowing(userId, vacationId) {
    if (await followingsDao.isFollowingExist(userId, vacationId)) {
        console.log("FOLLOWING_ALREADY_EXISTS");
        throw new ServerError(ErrorType.FOLLOWING_ALREADY_EXISTS);
    }
    await followingsDao.addFollowing(userId, vacationId)
    await vacationsLogic.updateVacationFollowingsAmount(vacationId)
}




async function deleteAllfollowingsByVacationId(vacationId) {

    if (await followingsDao.isVacationHasFollowings(vacationId)) {
        await followingsDao.deleteAllfollowingsByVacationId(vacationId)
    }
}

// deleteFollowing(1,14)

// addFollowing(1,14);


module.exports = {
    deleteFollowing,
    addFollowing,
    deleteAllfollowingsByVacationId
};