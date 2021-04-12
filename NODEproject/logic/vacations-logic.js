
const vacationsDao = require("../dao/vacations-dao");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");
const uuid = require("uuid");





async function getAllVacations(userData) {
    let allVacations = await vacationsDao.getAllVacations();
    let response = { allVacations: allVacations };

    if (!userData.hasOwnProperty('userType')) {

        let allMyFollowedVacations = await vacationsDao.getAllMyFollowedVacations(userData.userId)
        if (allMyFollowedVacations != null || isEmailFoundData.length != 0) {
            response.allMyFollowedVacations = allMyFollowedVacations
            console.log(allMyFollowedVacations)
        }
    }
    return response
}






async function deleteVacation(vacationId, type) {
    if (type == "ADMIN") {
        await vacationsDao.deleteVacation(vacationId);
    }
    else {
        throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
    }
}



async function addVacation(vacation, type) {
    if (type == "ADMIN") {
        await vacationsDao.addVacation(vacation)
        let allVacations = await vacationsDao.getAllVacations()
        return allVacations;
    }
    else {
        throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
    }
}


async function updateVacation(vacation, type) {
    if (type == "ADMIN") {
        await vacationsDao.updateVacation(vacation)
    }
    else {
        throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
    }
}




async function updateVacationFollowingsAmount(vacationId) {
    await vacationsDao.updateVacationFollowingsAmount(vacationId)
}




async function uploadVacationImage(file, type) {
    console.log("my type: " + type)
    if (type != "ADMIN") {
        throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
    }
    const extension = file.name.substr(file.name.lastIndexOf("."));
    const newUuidFileName = uuid.v4();
    file.mv("./uploads/" + newUuidFileName + extension);

    let successfulUploadResponse = newUuidFileName + extension + "";
    return successfulUploadResponse;
}




async function getAllFollowedVacations(type) {
    if (type == "ADMIN") {
        let allFollowedVacations = await vacationsDao.getAllFollowedVacations()
        return allFollowedVacations;
    }
    else {
        throw new ServerError(ErrorType.UNAUTHORIZED_USERTYPE);
    }
}



// getAllVacations({ userId: "2" })

// let vacation = {description : "gfdxg", picture:'xdg' ,start_date : '2020/05/05', end_date:'2020/05/05' , price:45.5,destination_id:4 }
// addVacation(vacation);

// deleteVacation(14,"ADMIN")

// let vacation = {id:14,description : "gfdxg", picture:'xdg' ,start_date : '2020/05/05', end_date:'2020/05/05' , price:45.5,destination_id:4 }
// updateVacation(vacation);

// updateVacationFollowingsAmount(1)

// getAllFollowedVacations() 



module.exports = {
    getAllVacations,
    addVacation,
    deleteVacation,
    updateVacationFollowingsAmount,
    updateVacation,
    uploadVacationImage,
    getAllFollowedVacations,
};