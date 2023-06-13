import mongoose, { Schema } from 'mongoose'

export interface IDriver {
  YEAR: number;
  POS: number;
  DRIVER: string;
  NATIONALITY: string;
  CAR: string;
  PTS: number;
}

const driverSchema = new Schema<IDriver> ({
  YEAR: {
    type: Number
  },
  POS: {
    type: Number 
  },
  DRIVER: {
    type: String
  },
  NATIONALITY: {
    type: String 
  },
  CAR: {
    type: String 
  },
  PTS: {
    type: Number 
  }
})

export const DriverModel = mongoose.connection.model('drivers', driverSchema)