const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");

async function addUser(user) {
  let sql = "INSERT INTO users SET password = ?,email =? , first_name = ?, last_name =?";
  let parameters = [user.password, user.email, user.firstName, user.lastName];

  try {
    await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }
}

async function login(user) {
  let sql = "SELECT id, first_name, last_name, user_type FROM users  WHERE email = ? and password =?";
  let parameters = [user.email, user.password];
  let userLoginResult;

  try {
    userLoginResult = await connection.executeWithParameters(sql, parameters);
    // console.log(userLoginResult)
  } catch (e) {
    console.log(e);
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }

  if (userLoginResult == null || userLoginResult.length == 0) {
    throw new ServerError(ErrorType.UNAUTHORIZED);
  }
  return userLoginResult[0];
}

async function isUserEmailExist(email) {
  let sql = "select email from users where email = ? ";
  let parameters = [email];
  let isEmailFoundData;

  try {
    isEmailFoundData = await connection.executeWithParameters(sql, parameters);
  } catch (e) {
    throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
  }

  if (isEmailFoundData == null || isEmailFoundData.length == 0) {
    return false;
  }

  return true;
}



// let user = {firstName:'dani' ,lastName : 'el', password:'45698' , email:'da18@gmail.com'}
// addUser(user);

// login({ email: "dani@gmail.com", password: "Ff1234" });

// isUserEmailExist("avi1@gmail.com")


module.exports = {
  login,
  addUser,
  isUserEmailExist
};
