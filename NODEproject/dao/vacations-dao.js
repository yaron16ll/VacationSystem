const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");



async function getAllVacations() {
  let sql = "select v.id,v.description,v.city,v.picture, DATE_FORMAT(v.start_date,'%m/%d/%Y') as startDate, DATE_FORMAT(v.end_date,'%m/%d/%Y') as endDate ,v.price,v.followings_amount,d.name as destinationName,d.id as destinationId  FROM vacations v join destinations d on v.destination_id = d.id";

  try {
    let allVacations = await connection.execute(sql);
    return allVacations;
  }
  catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function addVacation(vacation) {

  let sql = "INSERT INTO vacations SET description =? ,  city=?,picture = ?,start_date =?, end_date = ?, price=?,destination_id=?";
  let parameters = [vacation.description, vacation.city, vacation.picture, vacation.startDate, vacation.endDate, vacation.price, vacation.destinationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function deleteVacation(vacationId) {
  let sql = "delete from vacations where id = ?";
  let parameters = [vacationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}




async function updateVacation(vacation) {
  let sql = "update vacations set  description =? , city=?, picture=?,start_date =? ,end_date =? ,price=?, destination_id = ? where id =?";
  let parameters = [vacation.description, vacation.city, vacation.picture, vacation.startDate, vacation.endDate, vacation.price, vacation.destinationId, vacation.id];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}



async function updateVacationFollowingsAmount(vacationId) {
  let sql = "update vacations set followings_amount = (select count(id) from followings where vacation_id = ?) where id =?";
  let parameters = [vacationId, vacationId];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}


async function getAllMyFollowedVacations(userId) {
  let sql = "select vacation_id from followings where user_id = ?";
  let parameters = [userId];
  let vacationsIdArray = [];

  try {
    let myFollowedVacations = await connection.executeWithParameters(sql, parameters);
    for (let item of myFollowedVacations) {
      vacationsIdArray.push(item.vacation_id)
    }
    return vacationsIdArray;

  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}




async function getAllFollowedVacations() {
  let sql = "select id ,followings_amount from vacations where followings_amount > 0";

  try {
    let allFollowedVacations = await connection.execute(sql);
    return allFollowedVacations;
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

// getAllVacations()

// let vacation = {description : "gfdxg", picture:'xdg' ,start_date : '2020/05/05', end_date:'2020/05/05' , price:45.5,destination_id:4 }
// addVacation(vacation);

// deleteVacation(14)

// let vacation = {id:14,description : "gfdxg", picture:'xdg' ,start_date : '2020/05/05', end_date:'2020/05/05' , price:45.5,destination_id:4 }
// updateVacation(vacation);

// updateVacationFollowingsAmount(1)

// getAllFollowedVacations() 

module.exports = {
  getAllVacations,
  addVacation,
  deleteVacation,
  updateVacation,
  updateVacationFollowingsAmount,
  getAllFollowedVacations,
  getAllMyFollowedVacations
};
