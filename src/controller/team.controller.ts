import { Request, Response, NextFunction } from "express";
import validateCtrl, { Joi } from "../helpers/validateCtrl";
import { TeamModel } from "../mongo/model/team";

export default async (req: Request, res: Response, next: NextFunction) => {
  const validatedReq = validateCtrl(
    req,
    Joi.object({
      body: Joi.object({
        YEAR: Joi.number().default(2023),
        TEAM: Joi.string().allow(''),
      }),
    })
  );
  const { YEAR, TEAM } = validatedReq.body;
  const filter: any = {};
  if (YEAR !== undefined) {
    filter["YEAR"] = YEAR;
  }
  if (TEAM) {
    filter["TEAM"] = { $regex: ".*" + TEAM + ".*" };
  }
  const teams = await TeamModel.find(filter)
    .sort({
      POS: 1,
    })
    .lean();
  return res.json(teams);
};
