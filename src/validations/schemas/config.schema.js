import Joi from 'joi';
import * as commonSchema from './common.schema.js'

const searchConfigSchema = commonSchema.commonSearchSchema

export {
    searchConfigSchema,
}