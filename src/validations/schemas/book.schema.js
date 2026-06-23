import Joi from 'joi';


function requiredErrorMessage(name) {
    return `${name} is required.`
}

const bookIdSchema = Joi.object({
    id: Joi.number().required().messages({ 'any.required': requiredErrorMessage('id') })
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

export {bookIdSchema, addBookBodySchema}