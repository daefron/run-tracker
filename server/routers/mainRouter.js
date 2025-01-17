const { Router } = require("express");

const mainRouter = Router();

const fitbitDataController = require("../controllers/fitbitDataController");
const localDataController = require("../controllers/localDataController");
const authController = require("../controllers/authController");

mainRouter.get("/data", localDataController.launchGet);

mainRouter.get("/update", fitbitDataController.updateGet);

mainRouter.get("/auth", authController.refreshAuth);

module.exports = mainRouter;
