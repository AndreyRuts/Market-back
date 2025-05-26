import Joi from 'joi';

export const orderCreateValidationSchema = Joi.object({
    items: Joi.array()
        .items(
            Joi.object({
                product: Joi.string().length(24).hex().required(),
                quantity: Joi.number().integer().min(1).required(),
            })
        )
        .min(1)
        .required(),
    deliveryAddress: Joi.string().trim().min(5).max(500).required(),
    comments: Joi.string().trim().max(1000).allow('', null),
});
