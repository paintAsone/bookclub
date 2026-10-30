import Joi from 'joi';
import { commonSearchSchema, requiredErrorMessage } from './common.schema.js'

const searchWishlistSchema = commonSearchSchema.keys({
    category_id: Joi.number().optional(),
    status_id: Joi.number().optional(),
    merchant_id: Joi.number().optional(),
    publisher_id: Joi.number().optional(),
})

const wishlistIdSchema = Joi.object({
    id: Joi.number().required().messages({ 'any.required': requiredErrorMessage('id') })
})

const wishlistBodySchema = Joi.object({
    title: Joi.string().required().messages({ 'any.required': requiredErrorMessage('title') }),
    author: Joi.string().required().messages({ 'any.required': requiredErrorMessage('author') }),
    remark: Joi.string().optional(),
    publisher_id: Joi.number().optional(),
});

const wishlistMerchantParamsSchema = Joi.object({
    id: Joi.number().required().messages({ 'any.required': requiredErrorMessage('id') }),
    merchantId: Joi.number().required().messages({ 'any.required': requiredErrorMessage('merchantId') }),
})

const addWishlistMerchantBodySchema = Joi.object({
    merchant_id: Joi.number().integer().required().messages({ 'any.required': requiredErrorMessage('merchant_id') }),
    price: Joi.number().integer().min(0).required().messages({ 'any.required': requiredErrorMessage('price') }),
})

const editWishlistMerchantBodySchema = Joi.object({
    price: Joi.number().integer().min(0).required().messages({ 'any.required': requiredErrorMessage('price') }),
})

export {
    searchWishlistSchema,
    wishlistIdSchema,
    wishlistBodySchema,
    wishlistMerchantParamsSchema,
    addWishlistMerchantBodySchema,
    editWishlistMerchantBodySchema,
}