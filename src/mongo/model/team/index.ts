import mongoose, { Schema } from "mongoose";

export interface ITeam {
  YEAR: number;
  POS: number;
  TEAM: string;
  PTS: number;
}

const teamSchema = new Schema<ITeam>({
  YEAR: {
    type: Number,
  },
  POS: {
    type: Number,
  },
  TEAM: {
    type: String,
  },
  PTS: {
    type: Number,
  },
});

export const TeamModel = mongoose.connection.model("teams", teamSchema);
