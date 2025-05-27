import mongoose from "mongoose";

import { ALLOWED_CATEGORIES } from '../constants/constants.js';

const goodsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ALLOWED_CATEGORIES,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  images: [
    {
      public_id: { type: String },
      url: { type: String },
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
}, {
  timestamps: true,
});

export const Goods = mongoose.model('Goods', goodsSchema);
