import Joi from 'joi';

import { ALLOWED_CATEGORIES } from '../constants/constants.js';


export const goodsValidationSchema = Joi.object({
    title: Joi.string().trim().min(2).max(100).required(),
    description: Joi.string().trim().min(10).max(1000).required(),
    category: Joi.string().valid(...ALLOWED_CATEGORIES).required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().min(0).default(0),
    images: Joi.array().items(
        Joi.object({
            public_id: Joi.string(),
            url: Joi.string().uri(),
        })
    ),
});

export const goodsUpdateValidationSchema = Joi.object({
    title: Joi.string().trim().min(2).max(100),
    description: Joi.string().trim().min(10).max(1000),
    category: Joi.string().valid(...ALLOWED_CATEGORIES),
    price: Joi.number().min(0),
    quantity: Joi.number().min(0),
    images: Joi.array().items(
        Joi.object({
            public_id: Joi.string(),
            url: Joi.string().uri(),
        })
    ),
});
  