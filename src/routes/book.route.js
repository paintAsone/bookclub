import express from 'express'
import * as controller from '../controller/book.controller.js'

import { addBookBodySchema, addBookReviewBodySchema, bookIdSchema, searchBookSchema, bookReviewIdSchema } from '../validations/schemas/book.schema.js'
import { validation, property } from '../validations/schema.validator.js'

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Books
 *     description: Book management
 *   - name: Config
 *     description: Master data / configuration
 * components:
 *   parameters:
 *     Page:
 *       in: query
 *       name: page
 *       required: true
 *       schema: { type: number, example: 1 }
 *       description: Page number (starts at 1)
 *     Limit:
 *       in: query
 *       name: limit
 *       required: true
 *       schema: { type: number, example: 10 }
 *       description: Items per page
 *     SortBy:
 *       in: query
 *       name: sortBy
 *       required: true
 *       schema: { type: string, example: category_id }
 *       description: Column name to sort by
 *     OrderBy:
 *       in: query
 *       name: orderBy
 *       required: true
 *       schema: { type: string, enum: [ASC, DESC], example: ASC }
 *       description: Sort direction
 *     Search:
 *       in: query
 *       name: search
 *       required: false
 *       schema: { type: string, maxLength: 256 }
 *       description: Free-text search keyword
 *     BookId:
 *       in: path
 *       name: id
 *       required: true
 *       schema: { type: integer, example: 1 }
 *       description: Book ID
 *     BookReviewId:
 *       in: path
 *       name: bookReviewId
 *       required: true
 *       schema: { type: integer, example: 1 }
 *       description: Book review ID
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         book_id: { type: integer, example: 1 }
 *         title: { type: string, example: Clean Code }
 *         author: { type: string, example: Robert C. Martin }
 *         price: { type: number, format: double, example: 450.00 }
 *         purchase_date: { type: string, format: date, nullable: true, example: "2024-01-31" }
 *         summary: { type: string, nullable: true }
 *         category_id: { type: integer, nullable: true }
 *         status_id: { type: integer, nullable: true }
 *         merchant_id: { type: integer, nullable: true }
 *         publisher_id: { type: integer, nullable: true }
 *         created_date: { type: string, format: date-time }
 *         updated_date: { type: string, format: date-time }
 *     BookDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Book'
 *         - type: object
 *           properties:
 *             category: { type: string, nullable: true }
 *             status: { type: string, nullable: true }
 *             merchant: { type: string, nullable: true }
 *             publisher: { type: string, nullable: true }
 *     BookReviewDetail:
 *       type: object
 *       required: [book_review_id, book_id, rating]
 *       properties:
 *             book_review_id: { type: integer, example: 1 }
 *             book_id: { type: integer, example: 1 }
 *             rating: { type: number, example: 5 }
 *             review_comment: { type: string, example: Very good book }
 *             review_date: { type: string, format: date, nullable: false, example: "2024-01-31" }
 *             created_date: { type: string, format: date, nullable: true, example: "2024-01-31" }
 *             updated_date: { type: string, format: date, nullable: true, example: "2024-01-31" }
 *     BookInput:
 *       type: object
 *       required: [title, author, price]
 *       properties:
 *         title: { type: string, example: Clean Code }
 *         author: { type: string, example: Robert C. Martin }
 *         price: { type: number, example: 450 }
 *         purchase_date: { type: string, format: date, nullable: true, example: "2024-01-31" }
 *         summary: { type: string, nullable: true }
 *         category_id: { type: integer }
 *         status_id: { type: integer }
 *         merchant_id: { type: integer }
 *         publisher_id: { type: integer }
 *     Category:
 *       type: object
 *       properties:
 *         category_id: { type: integer, example: 1 }
 *         category_name: { type: string }
 *         category_description: { type: string }
 *         created_date: { type: string, format: date-time }
 *         updated_date: { type: string, format: date-time }
 *     SuccessMessage:
 *       type: object
 *       properties:
 *         code: { type: string, example: "20000" }
 *         message: { type: string, example: Successfully update book. }
 *     ValidationError:
 *       type: object
 *       properties:
 *         status: { type: integer, description: "40001 = missing required field, 40002 = invalid value", example: 40001 }
 *         message: { type: string, example: page is required. }
 *     NotFoundError:
 *       type: object
 *       properties:
 *         code: { type: integer, example: 40400 }
 *         message: { type: string, example: data not found }
 *     InternalError:
 *       type: object
 *       properties:
 *         code: { type: integer, example: 50000 }
 *         message: { type: string, example: Internal Error }
 *   responses:
 *     ValidationError:
 *       description: Validation error
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ValidationError' }
 *     NotFound:
 *       description: Book not found
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NotFoundError' }
 *     InternalError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/InternalError' }
 */

/**
 * @swagger
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Search books
 *     description: Returns a paginated list of books. `search` matches title and author.
 *     parameters:
 *       - $ref: '#/components/parameters/Page'
 *       - $ref: '#/components/parameters/Limit'
 *       - $ref: '#/components/parameters/SortBy'
 *       - $ref: '#/components/parameters/OrderBy'
 *       - $ref: '#/components/parameters/Search'
 *       - in: query
 *         name: category_id
 *         schema: { type: number }
 *         description: Filter by category ID
 *       - in: query
 *         name: status_id
 *         schema: { type: number }
 *         description: Filter by status ID
 *       - in: query
 *         name: merchant_id
 *         schema: { type: number }
 *         description: Filter by merchant ID
 *       - in: query
 *         name: publisher_id
 *         schema: { type: number }
 *         description: Filter by publisher ID
 *     responses:
 *       200:
 *         description: Successfully with data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: integer, example: 20010 }
 *                 message: { type: string, example: Successfully with data. }
 *                 result:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Book' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.get('/', validation(searchBookSchema, property.QUERY), controller.getBookList)

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by ID
 *     description: Returns a single book with its category, status, merchant and publisher names.
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     responses:
 *       200:
 *         description: Successfully with data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: integer, example: 20010 }
 *                 message: { type: string, example: Successfully with data. }
 *                 result: { $ref: '#/components/schemas/BookDetail' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.get('/:id', validation(bookIdSchema, property.PARAMS), controller.getBookDetail)

/**
 * @swagger
 * /books:
 *   post:
 *     tags: [Books]
 *     summary: Add a book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookInput' }
 *     responses:
 *       201:
 *         description: Book created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20001" }
 *                 message: { type: string, example: Successfully add book. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.post('/', validation(addBookBodySchema, property.BODY), controller.addBook)

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     tags: [Books]
 *     summary: Update a book
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BookInput' }
 *     responses:
 *       200:
 *         description: Book updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessMessage' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.put('/:id', validation(bookIdSchema, property.PARAMS), validation(addBookBodySchema, property.BODY), controller.editBook)

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete a book
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     responses:
 *       200:
 *         description: Book deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20000" }
 *                 message: { type: string, example: Successfully remove book. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.delete('/:id', validation(bookIdSchema, property.PARAMS), controller.removeBook)

/**
 * @swagger
 * /books/{id}/reviews:
 *   get:
 *     tags: [Books]
 *     summary: Get book reviews by book by ID
 *     description: Returns list of reviews of the book.
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     responses:
 *       200:
 *         description: Successfully with data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: integer, example: 20010 }
 *                 message: { type: string, example: Successfully with data. }
 *                 result: { $ref: '#/components/schemas/BookReviewDetail' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.get('/:id/reviews', validation(bookIdSchema, property.PARAMS), controller.getBookReviewList)

/**
 * @swagger
 * /books/{id}/reviews:
 *   post:
 *     tags: [Books]
 *     summary: Add a book review
 *     description: Calls stored procedure `sp_AddBookReview`. Adds the review and sets the book's status_id to 4 in one transaction.
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5, example: 5 }
 *               review_comment: { type: string, maxLength: 255, nullable: true, example: Very good book }
 *               review_date: { type: string, format: date, nullable: true, description: Defaults to today, example: "2024-01-31" }
 *     responses:
 *       201:
 *         description: Review created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code: { type: string, example: "20001" }
 *                 message: { type: string, example: Successfully add book review. }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.post('/:id/reviews', validation(bookIdSchema, property.PARAMS), validation(addBookReviewBodySchema, property.BODY), controller.addBookReview)

/**
 * @swagger
 * /books/{id}/reviews/{bookReviewId}:
 *   put:
 *     tags: [Books]
 *     summary: Update a book review
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *       - $ref: '#/components/parameters/BookReviewId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating: { type: integer, minimum: 1, maximum: 5, example: 5 }
 *               review_comment: { type: string, maxLength: 255, nullable: true, example: Very good book }
 *               review_date: { type: string, format: date, nullable: true, example: "2024-01-31" }
 *     responses:
 *       200:
 *         description: Review updated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessMessage' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.put('/:id/reviews/:bookReviewId', validation(bookReviewIdSchema, property.PARAMS), validation(addBookReviewBodySchema, property.BODY), controller.editBookReview)

/**
 * @swagger
 * /books/{id}/reviews/{bookReviewId}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete Book Review
 *     description: Calls stored procedure `sp_DeleteBookReview`. Deleete the review and sets the book's status_id to 3 if the book has no review left.
 *     parameters:
 *       - $ref: '#/components/parameters/BookId'
 *       - $ref: '#/components/parameters/BookReviewId'
 *     responses:
 *       200:
 *         description: Review deleted
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessMessage' }
 *       400: { $ref: '#/components/responses/ValidationError' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
router.delete('/:id/reviews/:bookReviewId', validation(bookReviewIdSchema, property.PARAMS), controller.removeBookReview)

export {
    router
}