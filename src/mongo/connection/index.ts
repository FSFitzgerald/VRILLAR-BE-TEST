import mongoose, { ConnectOptions } from "mongoose";
import { injectable } from "inversify";
import { TYPES } from "../../IoC/types";
import { container } from "../../IoC";

@injectable()
export class MongoDatabase {
  async connect() {
    const config = container.get<Config>(TYPES.Config);
    const { host, name, usersDB, password } =
      config.mongodb;

    return mongoose.connect(
      `mongodb+srv://${usersDB}:${password}@${host}/?retryWrites=true&w=majority`,
      {
        dbName: name,
        maxIdleTimeMS: 120000,
      }
    );
  }
}

@injectable()
export class A {}
