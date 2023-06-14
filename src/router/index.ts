import express from "express";
import searchRaceController from "../controller/race.controler";
import searchDriverController from "../controller/driver.controller";
import searchTeamController from "../controller/team.controller";

const router = express.Router();
router.get("/races", searchRaceController);
router.get("/drivers", searchDriverController);
router.get("/teams", searchTeamController);

export default router