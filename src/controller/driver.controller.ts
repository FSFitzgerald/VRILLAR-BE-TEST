import { Request, Response, NextFunction } from "express";
import validateCtrl, { Joi } from "../helpers/validateCtrl";
import { DriverModel } from "../mongo/model/driver";

export default async (req: Request, res: Response, next: NextFunction) => {
  const validatedReq = validateCtrl(
    req,
    Joi.object({
      body: Joi.object({
        YEAR: Joi.number().default(2023),
        DRIVER: Joi.string().allow(''),
        NATIONALITY: Joi.string().allow(''),
        CAR: Joi.string().allow(''),
      }),
    })
  );
  const { YEAR, DRIVER, NATIONALITY, CAR } = validatedReq.body;
  const filter: any = {};
  if (YEAR !== undefined) {
    filter["YEAR"] = YEAR;
  }
  if (DRIVER) {
    filter["DRIVER"] = { $regex: ".*" + DRIVER + ".*" };
  }
  if (NATIONALITY) {
    filter["NATIONALITY"] = { $regex: ".*" + NATIONALITY + ".*" };
  }
  if (CAR) {
    filter["CAR"] = { $regex: ".*" + CAR + ".*" };
  }
  const drivers = await DriverModel.find(filter)
    .sort({
      POS: 1,
    })
    .lean();
  return res.json(drivers);
};
