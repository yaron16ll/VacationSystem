const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");



async function deleteFollowing(userId, vacationId) {
  let sql = "delete from followings where user_id = ? and vacation_id=?";
  let parameters = [userId, vacationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  }
  catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function addFollowing(userId, vacationId) {
  let sql = "insert into followings set user_id =?  , vacation_id = ?";
  let parameters = [userId, vacationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}


async function isFollowingExist(userId, vacationId) {
  let sql = "select id from followings where user_id = ? and vacation_id=?";
  let parameters = [userId, vacationId];
  let isFollowFoundData;

  try {
    isFollowFoundData = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }

  if (isFollowFoundData == null || isFollowFoundData.length == 0) {
    return false;
  }
  return true;
}



async function deleteAllfollowingsByVacationId(vacationId) {
  let sql = "delete from followings where vacation_id=? ";
  let parameters = [vacationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function isVacationHasFollowings(vacationId) {
  let sql = "select id from followings where vacation_id = ?";
  let parameters = [vacationId];
  let isFollowingsFoundData;

  try {
    isFollowingsFoundData = await connection.executeWithParameters(sql, parameters);
  }
  catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }

  if (isFollowingsFoundData == null || isFollowingsFoundData.length == 0) {
    return false;
  }
  return true;
}


// deleteFollowing(1,5)

// addFollowing(1,5);

// deleteAllfollowingsByVacationId(14) 

module.exports = {
  deleteFollowing,
  addFollowing,
  isFollowingExist,
  isVacationHasFollowings,
  deleteAllfollowingsByVacationId,
};
