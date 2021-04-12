const connection = require("./connection-wrapper");
const ErrorType = require("../errors/error-type");
const ServerError = require("../errors/server-error");



async function getAllDestinations() {
    let sql = "select * from destinations ";

    try {
        let allDestinations = await connection.execute(sql);
        console.log(allDestinations)
        return allDestinations;
    }
    catch (e) {
        throw new ServerError(ErrorType.GENERAL_ERROR, sql, e);
    }
}



// getAllDestinations()


module.exports = {
    getAllDestinations
};
