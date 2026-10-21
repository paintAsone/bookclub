import Joi from 'joi';
import { commonSearchSchema, requiredErrorMessage } from './common.schema.js'

const searchBookSchema = commonSearchSchema.keys({
    category_id: Joi.number().optional(),
    status_id: Joi.number().optional(),
    merchant_id: Joi.number().optional(),
    publisher_id: Joi.number().optional(),
})

const bookIdSchema = Joi.object({
    id: Joi.number().required().messages({ 'any.required': requiredErrorMessage('id') })
})

const bookReviewIdSchema = bookIdSchema.keys({
    bookReviewId: Joi.number().required().messages({ 'any.required': requiredErrorMessage('bookReviewId') })
})

const addBookBodySchema = Joi.object({
    title: Joi.string().required().messages({ 'any.required': requiredErrorMessage('title') }),
    author: Joi.string().required().messages({ 'any.required': requiredErrorMessage('author') }),
    price: Joi.number().required().messages({ 'any.required': requiredErrorMessage('price') }),
    purchase_date: Joi.date().allow(null, '').optional(),
    summary: Joi.string().allow(null, '').optional(),
    category_id: Joi.number().optional(),
    status_id: Joi.number().optional(),
    merchant_id: Joi.number().optional(),
    publisher_id: Joi.number().optional(),
});

const addBookReviewBodySchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required().messages({
        'any.required': requiredErrorMessage('rating'),
        'number.min': 'rating must be between 1 and 5.',
        'number.max': 'rating must be between 1 and 5.',
    }),
    review_comment: Joi.string().max(255).allow(null, '').optional(),
    review_date: Joi.date().allow(null, '').optional(),
});

export { bookIdSchema, addBookBodySchema, searchBookSchema, addBookReviewBodySchema, bookReviewIdSchema }