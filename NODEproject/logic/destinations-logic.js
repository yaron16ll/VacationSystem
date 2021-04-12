const destinationsDao = require("../dao/destinations-dao");



async function getAllDestinations() {
    let allDestinations = await destinationsDao.getAllDestinations();
    console.log(allDestinations)
    return allDestinations;
}


// getAllDestinations()

module.exports = {
    getAllDestinations,
};