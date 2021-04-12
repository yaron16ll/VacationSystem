const usersDao = require("../dao/users-dao");
const cacheModule = require("../dao/cache-module");
const jwt = require("jsonwebtoken");
const config = require("../config.json");

let ErrorType = require("./../errors/error-type");
let ServerError = require("./../errors/server-error");

const RIGHT_SALT = "ksdjfhbAWEDCAS29!@$addlkmn";
const LEFT_SALT = "32577098ASFKJkjsdhfk#$dc";




async function login(user) {
  let userData = await usersDao.login(user);

  let saltedEmail = LEFT_SALT + user.email + RIGHT_SALT;
  const jwtToken = jwt.sign({ sub: saltedEmail }, config.secret);

  // console.log("Token before adding to cache : " + jwtToken);
  // console.log("User Data before adding to cache : " + JSON.stringify(userData));

  let object = { userId: userData.id };

  let successfullLoginResponse = {
    token: jwtToken,
    firstName: userData.first_name,
    lastName: userData.last_name
  };

  if (userData.user_type == "ADMIN") {
    object.userType = "ADMIN";
  } else {
    successfullLoginResponse.userType = "CUSTOMER";
  }

  cacheModule.set(jwtToken, object);

  cacheModule.printAll();
  return successfullLoginResponse;
}



async function addUser(user) {
  // Validations
  if (await usersDao.isUserEmailExist(user.email)) {
    console.log("EMAIL_ALREADY_EXISTS");
    throw new ServerError(ErrorType.EMAIL_ALREADY_EXISTS);
  }
  await usersDao.addUser(user);
}


function disconnect(userToken) {
  // Validations
  if (userToken) {
    cacheModule.deleteByKey(userToken.token);
    cacheModule.printAll();
  } else {
    throw new ServerError(ErrorType.UNKNOWN_VALUE);
  }
}

// let user = { firstName:'dani' ,lastName : 'el', password:'45698' , email:'da18@gmail.com'}
// addUser(user);

// login({ email: "dani@gmail.com", password: "Ff1234" });

module.exports = {
  login,
  addUser,
  disconnect,
};
