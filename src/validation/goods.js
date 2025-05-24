import Joi from 'joi';

const ALLOWED_CATEGORIES = ['electronics', 'clothing', 'books', 'toys', 'home', 'beauty'];

export const goodsValidationSchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    category: Joi.string().valid(...ALLOWED_CATEGORIES).required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).default(0),
    images: Joi.array().items(
        Joi.object({
            public_id: Joi.string().required(),
            url: Joi.string().uri().required(),
        })
    ).min(1).required(),
    seller: Joi.string().required(),
});

export const goodsUpdateValidationSchema = Joi.object({
    title: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().min(10).max(1000),
    category: Joi.string().valid(...ALLOWED_CATEGORIES),
    price: Joi.number().min(0),
    quantity: Joi.number().min(0),
    images: Joi.array().items(
        Joi.object({
            public_id: Joi.string().required(),
            url: Joi.string().uri().required(),
        })
    ),
    seller: Joi.string(),
});
  