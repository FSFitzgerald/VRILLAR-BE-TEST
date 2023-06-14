import "reflect-metadata";
import { initIoC, container } from "./IoC";
import { MongoDatabase } from "./mongo/connection";
import { TYPES } from "./IoC/types";
import { RaceModel } from "./mongo/model/race";
import { DriverModel } from "./mongo/model/driver";
import { TeamModel } from "./mongo/model/team";
import fs from "fs";
import express from "express";
import router from './router'
import { errorHandleMiddleware } from './middlewares/errorHandleMiddleware'

async function main() {
  initIoC();

  const mongoDatabase = container.get<MongoDatabase>(TYPES.MongoDatabase);
  mongoDatabase.connect().then(async () => {
    console.info("MongoDB connected successfully!");
  });

  // await initDB()

  const app = express();
  app.use(express.json());
  app.use(errorHandleMiddleware())
  app.listen(3000, () => {
    console.log("listening on port 3000");
  });  

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
