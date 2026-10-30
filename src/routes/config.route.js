import express from 'express'
import * as controller from '../controller/config.controller.js'
import { validation, property } from '../validations/schema.validator.js'
import { searchConfigSchema } from '../validations/schemas/config.schema.js'

const router = express.Router();

/**
 * @swagger
 * /config/category:
 *   get:
 *     tags: [Config]
 *     summary: Search categories
 *     description: Returns a paginated list of categories. `search` matches category name.
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/SortBy'
 *       - $ref: '#/components/parameters/OrderBy'
 *       - $ref: '#/components/parameters/Search'
 *     responses:
 *       200:
 *         description: Successfully with data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20010" }
 *                 message: { type: string, example: Successfully with data. }
 *                 result:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Category' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.get('/category', validation(searchConfigSchema, property.QUERY), controller.getCategoryController)

export {
    router
}