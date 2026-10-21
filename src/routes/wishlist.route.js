import express from 'express'
import * as controller from '../controller/wishlist.controller.js'

import { searchWishlistSchema, wishlistIdSchema, wishlistBodySchema, wishlistMerchantParamsSchema, addWishlistMerchantBodySchema, editWishlistMerchantBodySchema } from '../validations/schemas/wishlist.schema.js'
import { validation, property } from '../validations/schema.validator.js'

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: Wishlist management
 * components:
 *   schemas:
 *     Wishlist:
 *       type: object
 *       properties:
 *         wishlist_id: { type: integer, example: 1 }
 *         title: { type: string, example: Clean Code }
 *         author: { type: string, example: Robert C. Martin }
 *         remark: { type: string, nullable: true, example: Buy on sale }
 *         publisher_id: { type: integer, nullable: true, example: 1 }
 *         publisher_name: { type: string, nullable: true, example: Prentice Hall }
 *     WishlistDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Wishlist'
 *         - type: object
 *           properties:
 *             merchant_id: { type: integer, nullable: true, example: 1 }
 *             merchant_name: { type: string, nullable: true, example: Amazon }
 *             price: { type: integer, nullable: true, example: 450 }
 *     WishlistInput:
 *       type: object
 *       required: [title, author]
 *       properties:
 *         title: { type: string, maxLength: 255, example: Clean Code }
 *         author: { type: string, maxLength: 255, example: Robert C. Martin }
 *         remark: { type: string, maxLength: 255, example: Buy on sale }
 *         publisher_id: { type: integer, example: 1 }
 *   parameters:
 *     WishlistId:
 *       in: path
 *       name: id
 *       required: true
 *       schema: { type: integer, example: 1 }
 *       description: Wishlist ID
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     tags: [Wishlist]
 *     summary: Search wishlist
 *     description: Returns a paginated list of wishlist items. `search` matches title, author and publisher name.
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - in: query
 *         name: sortBy
 *         required: true
 *         schema:
 *           type: string
 *           enum: [wishlist_id, title, author, remark, publisher_id, publisher_name, created_date, updated_date]
 *           example: wishlist_id
 *         description: Column to sort by (unknown values fall back to wishlist_id)
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
 *                   items: { $ref: '#/components/schemas/Wishlist' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.get('/', validation(searchWishlistSchema, property.QUERY), controller.getWishlistList)

/**
 * @swagger
 * /wishlist/{id}:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get wishlist by ID
 *     description: Returns the wishlist item with its publisher name, one row per merchant selling it (merchant name and price). Returns an empty `result` array when the ID does not exist.
 *     parameters:
 *       - $ref: '#/components/parameters/WishlistId'
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
 *                   items: { $ref: '#/components/schemas/WishlistDetail' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.get('/:id', validation(wishlistIdSchema, property.PARAMS), controller.getWishlistDetail)

/**
 * @swagger
 * /wishlist/{id}/cheapest:
 *   get:
 *     tags: [Wishlist]
 *     summary: Get the cheapest merchant price of a wishlist item
 *     description: Calls table-valued function `fn_GetCheapestWishlistPriceWithMerchant`. `result` is null when the wishlist has no merchant prices yet.
 *     parameters:
 *       - $ref: '#/components/parameters/WishlistId'
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
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     title: { type: string, example: Project Hail Mary }
 *                     price: { type: number, example: 150 }
 *                     merchant_id: { type: integer, example: 1 }
 *                     merchant_name: { type: string, example: B2S }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.get('/:id/cheapest', validation(wishlistIdSchema, property.PARAMS), controller.getCheapestWishlistPrice)

/**
 * @swagger
 * /wishlist/{id}:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add a wishlist item
 *     description: Only `title`, `author`, `remark` and `publisher_id` from the body are saved. The `id` path segment is validated but not used when creating.
 *     parameters:
 *       - $ref: '#/components/parameters/WishlistId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WishlistInput' }
 *     responses:
 *       201:
 *         description: Wishlist created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20001" }
 *                 message: { type: string, example: Successfully add wishlist. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.post('/:id', validation(wishlistIdSchema, property.PARAMS), validation(wishlistBodySchema, property.BODY), controller.addWishlist)

/**
 * @swagger
 * /wishlist/{id}:
 *   put:
 *     tags: [Wishlist]
 *     summary: Update a wishlist item
 *     parameters:
 *       - $ref: '#/components/parameters/WishlistId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WishlistInput' }
 *     responses:
 *       200:
 *         description: Wishlist updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20000" }
 *                 message: { type: string, example: Successfully update wishlist. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.put('/:id', validation(wishlistIdSchema, property.PARAMS), validation(wishlistBodySchema, property.BODY), controller.editWishlist)

/**
 * @swagger
 * /wishlist/{id}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Delete a wishlist item
 *     description: Calls stored procedure `sp_DeleteWishlist`.
 *     parameters:
 *       - $ref: '#/components/parameters/WishlistId'
 *     responses:
 *       200:
 *         description: Wishlist deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20000" }
 *                 message: { type: string, example: Successfully remove wishlist. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.delete('/:id', validation(wishlistIdSchema, property.PARAMS), controller.removeWishlist)

/**
 * @swagger
 * /wishlist/{id}/merchants:
 *   post:
 *     tags: [Wishlist]
 *     summary: Add a merchant price to a wishlist item
 *     parameters:
 *       - $ref: '#/components/parameters/WishlistId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [merchant_id, price]
 *             properties:
 *               merchant_id: { type: integer, example: 1 }
 *               price: { type: integer, minimum: 0, example: 450 }
 *     responses:
 *       201:
 *         description: Merchant price added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20001" }
 *                 message: { type: string, example: Successfully add wishlist merchant. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       409:
 *         description: The merchant already exists in this wishlist
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.post('/:id/merchants', validation(wishlistIdSchema, property.PARAMS), validation(addWishlistMerchantBodySchema, property.BODY), controller.addWishlistMerchant)

/**
 * @swagger
 * /wishlist/{id}/merchants/{merchantId}:
 *   put:
 *     tags: [Wishlist]
 *     summary: Update a merchant price of a wishlist item
 *     parameters:
 *       - $ref: '#/components/parameters/WishlistId'
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema: { type: integer, example: 1 }
 *         description: Merchant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [price]
 *             properties:
 *               price: { type: integer, minimum: 0, example: 399 }
 *     responses:
 *       200:
 *         description: Merchant price updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20000" }
 *                 message: { type: string, example: Successfully update wishlist merchant. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.put('/:id/merchants/:merchantId', validation(wishlistMerchantParamsSchema, property.PARAMS), validation(editWishlistMerchantBodySchema, property.BODY), controller.editWishlistMerchant)

/**
 * @swagger
 * /wishlist/{id}/merchants/{merchantId}:
 *   delete:
 *     tags: [Wishlist]
 *     summary: Remove a merchant from a wishlist item
 *     parameters:
 *       - $ref: '#/components/parameters/WishlistId'
 *       - in: path
 *         name: merchantId
 *         required: true
 *         schema: { type: integer, example: 1 }
 *         description: Merchant ID
 *     responses:
 *       200:
 *         description: Merchant removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20000" }
 *                 message: { type: string, example: Successfully remove wishlist merchant. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.delete('/:id/merchants/:merchantId', validation(wishlistMerchantParamsSchema, property.PARAMS), controller.removeWishlistMerchant)

export {
    router
}