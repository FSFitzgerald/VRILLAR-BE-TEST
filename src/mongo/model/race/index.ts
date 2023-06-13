import mongoose, { Schema } from 'mongoose'

export interface IRace {
  YEAR: number;
  GRAND_PRIX: string;
  DATE: string;
  WINNER: string;
  CAR: string;
  LAPS: number;
  TIME: string;
}

const raceSchema = new Schema<IRace> ({
  YEAR: {
    type: Number
  },
  GRAND_PRIX: {
    type: String 
  },
  DATE: {
    type: String
  },
  WINNER: {
    type: String 
  },
  CAR: {
    type: String 
  },
  LAPS: {
    type: Number 
  },
  TIME: {
    type: String
  }
})

export const RaceModel = mongoose.connection.model('races', raceSchema)