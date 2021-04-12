const destinationsLogic = require("../logic/destinations-logic");
const express = require("express");

const router = express.Router();

//GET ALL DESTINATIONS
// GET http://localhost:3000/destinations/all
router.get("/all", async (request, response, next) => {
  try {
    let allDestinations = await destinationsLogic.getAllDestinations();
    response.json(allDestinations);
  }
  catch (error) {
    // console.log(error);
    return next(error);
  }
});

module.exports = router;
