import Joi from 'joi';

function requiredErrorMessage(name) {
    return `${name} is required.`
}

const commonSearchSchema = Joi.object({
    page: Joi.number().required().messages({
        'any.required': requiredErrorMessage('page')
    }),
    limit: Joi.number().required().messages({
        'any.required': requiredErrorMessage('limit')
    }),
    sortBy: Joi.string().trim().required().messages({
        'any.required': requiredErrorMessage('sortBy')
    }),
    orderBy: Joi.string().valid('ASC', 'DESC').trim().required().messages({
        'any.required': requiredErrorMessage('sortBy'),
        'any.valid': 'orderBy should be ASC or DESC.'
    }),
    search: Joi.string().trim().max(256).optional()
}).unknown()

export {
    commonSearchSchema,
    requiredErrorMessage,
}