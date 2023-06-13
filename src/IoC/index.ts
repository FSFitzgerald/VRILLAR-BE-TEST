import { TYPES } from './types'
import { MongoDatabase } from '../mongo/connection'
import config from '../config'
import { Container } from 'inversify'

export const container = new Container()

export function initIoC() {
  container.bind(TYPES.MongoDatabase).to(MongoDatabase)
  container.bind(TYPES.Config).toConstantValue(config)
  container.bind(TYPES.Container).toConstantValue(container)
}
