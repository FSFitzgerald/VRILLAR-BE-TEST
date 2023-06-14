import { Request, Response, NextFunction } from "express";
import validateCtrl, { Joi } from "../helpers/validateCtrl";
import { RaceModel } from "../mongo/model/race";

export default async (req: Request, res: Response, next: NextFunction) => {
  const validatedReq = validateCtrl(
    req,
    Joi.object({
      body: Joi.object({
        YEAR: Joi.number().default(2023),
        GRAND_PRIX: Joi.string().allow(''),
        WINNER: Joi.string().allow(''),
        CAR: Joi.string().allow(''),
      }),
    })
  );
  const { YEAR, GRAND_PRIX, WINNER, CAR } = validatedReq.body;
  const filter: any = {};
  if (YEAR !== undefined) {
    filter["YEAR"] = YEAR;
  }
  if (GRAND_PRIX) {
    filter["GRAND_PRIX"] = { $regex: ".*" + GRAND_PRIX + ".*" };
  }
  if (WINNER) {
    filter["WINNER"] = { $regex: ".*" + WINNER + ".*" };
  }
  if (CAR) {
    filter["CAR"] = { $regex: ".*" + CAR + ".*" };
  }
  const races = await RaceModel.find(filter).lean();
  return res.json(races);
};
