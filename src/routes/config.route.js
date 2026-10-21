// const express = require('express')
import express from 'express'
import * as controller from '../controller/config.controller.js'
import { validation, property } from '../validations/schema.validator.js'
import { searchConfigSchema } from '../validations/schemas/config.schema.js'

const router = express.Router();

router.get('/category', validation(searchConfigSchema, property.QUERY), controller.getCategoryController)

export {
    router
}