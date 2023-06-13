import { ValidationError, Schema } from 'joi'
import { Request } from 'express'

export default (req: Request, schema: Schema) => {
  const { error, value } = schema.validate(
    {
      query: req.query,
      params: req.params,
      body: req.body,
    },
    { allowUnknown: true, stripUnknown: true }
  )
  if (error instanceof ValidationError) throw error
  return value
}

export { default as Joi, ValidationError } from 'joi'
