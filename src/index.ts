import "reflect-metadata";
import { initIoC, container } from "./IoC";
import { MongoDatabase } from "./mongo/connection";
import { TYPES } from "./IoC/types";
import { RaceModel } from "./mongo/model/race";
import { DriverModel } from "./mongo/model/driver";
import { TeamModel } from "./mongo/model/team";
import fs from "fs";
import express from "express";
import validateCtrl, { Joi } from "./helpers/validateCtrl";

async function main() {
  initIoC();

  const mongoDatabase = container.get<MongoDatabase>(TYPES.MongoDatabase);
  mongoDatabase.connect().then(async () => {
    console.info("MongoDB connected successfully!");
  });

  // await initDB()

  const app = express();
  app.use(express.json());
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });

  const router = express.Router();
  router.get("/races", async (req, res, next) => {
    const validatedReq = validateCtrl(
      req,
      Joi.object({
        body: Joi.object({
          YEAR: Joi.number().required(),
          GRAND_PRIX: Joi.string(),
          WINNER: Joi.string(),
          CAR: Joi.string()
        }),
      })
    );
    const { YEAR, GRAND_PRIX, WINNER, CAR } = validatedReq.body;
    const filter: any = {};
    if (YEAR !== undefined) {
      filter["YEAR"] = YEAR;
    }
    if(GRAND_PRIX) {
      filter['GRAND_PRIX'] = { $regex: '.*' + GRAND_PRIX + '.*' }
    }
    if(WINNER) {
      filter['WINNER'] = { $regex: '.*' + WINNER + '.*' }
    }
    if(CAR) {
      filter['CAR'] = { $regex: '.*' + CAR + '.*' }
    }
    const races = await RaceModel.find(filter).lean();
    return res.json(races);
  });
  router.get("/drivers", async (req, res, next) => {
    const validatedReq = validateCtrl(
      req,
      Joi.object({
        body: Joi.object({
          YEAR: Joi.number().required(),
          DRIVER: Joi.string(),
          NATIONALITY: Joi.string(),
          CAR: Joi.string()
        }),
      })
    );
    const { YEAR, DRIVER, NATIONALITY, CAR } = validatedReq.body;
    const filter: any = {};
    if (YEAR !== undefined) {
      filter["YEAR"] = YEAR;
    }
    if(DRIVER) {
      filter['DRIVER'] = { $regex: '.*' + DRIVER + '.*' }
    }
    if(NATIONALITY) {
      filter['NATIONALITY'] = { $regex: '.*' + NATIONALITY + '.*' }
    }
    if(CAR) {
      filter['CAR'] = { $regex: '.*' + CAR + '.*' }
    }
    const drivers = await DriverModel.find(filter)
      .sort({
        POS: 1,
      })
      .lean();
    return res.json(drivers);
  });
  router.get('/teams', async (req, res, next) => {
    const validatedReq = validateCtrl(
      req,
      Joi.object({
        body: Joi.object({
          YEAR: Joi.number().required(),
          TEAM: Joi.string()
        }),
      })
    );
    const { YEAR , TEAM} = validatedReq.body;
    const filter: any = {};
    if (YEAR !== undefined) {
      filter["YEAR"] = YEAR;
    }
    if(TEAM) {
      filter['TEAM'] = { $regex: '.*' + TEAM + '.*' }
    }
    const teams = await TeamModel.find(filter)
      .sort({
        POS: 1,
      })
      .lean();
    return res.json(teams);
  })

  app.use(router);
}

async function initDB() {
  const chunk = 100;

  const racesStr: string = fs.readFileSync("races.json", { encoding: "utf-8" });
  const racesData: [] = JSON.parse(racesStr);
  for (let i = 0; i <= racesData.length / chunk; i++) {
    console.log(i);
    const chunkData = racesData.slice(chunk * i, (i + 1) * chunk);
    await RaceModel.bulkWrite(
      chunkData.map((item) => {
        return {
          updateOne: {
            filter: {},
            update: { $set: item },
            upsert: true,
          },
        };
      })
    );
  }

  const driverStr: string = fs.readFileSync("drivers.json", {
    encoding: "utf-8",
  });
  const driversData = JSON.parse(driverStr);
  for (let i = 0; i <= driversData.length / chunk; i++) {
    console.log(i);
    const chunkData = driversData.slice(chunk * i, (i + 1) * chunk);
    await DriverModel.bulkWrite(
      chunkData.map((item) => {
        return {
          updateOne: {
            filter: {},
            update: { $set: item },
            upsert: true,
          },
        };
      })
    );
  }

  const teamStr: string = fs.readFileSync("teams.json", { encoding: "utf-8" });
  const teamsData = JSON.parse(teamStr);
  for (let i = 0; i <= teamsData.length / chunk; i++) {
    console.log(i);
    const chunkData = teamsData.slice(chunk * i, (i + 1) * chunk);
    await TeamModel.bulkWrite(
      chunkData.map((item) => {
        return {
          updateOne: {
            filter: {},
            update: { $set: item },
            upsert: true,
          },
        };
      })
    );
  }
}

main();
