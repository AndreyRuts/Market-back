// import * as fs from 'node:fs/promises';
// import path from 'path';
import createHttpError from 'http-errors';

import {
    getAllGoods,
    getOwnGoods,
    createGoods,
    getGoodsById,
    updateGoods,
    deleteGoods
} from "../services/goods.js";


export const getAllGoodsController = async (req, res) => {
    const response = await getAllGoods();
    res.status(200).json({
        status: 200,
        message: 'Successfully found all public goods!',
        data: response
    });
};

export const getGoodsByIdController = async (req, res, next) => {
    const { id } = req.params;
    const goods = await getGoodsById(id);

    if (!goods) {
      throw createHttpError(404, 'Goods not found');
    }
  
    res.status(200).json({
      status: 200,
      message: `Successfully found goods with id ${id}`,
      data: goods,
    });
  };

export const getOwnGoodsController = async (req, res) => {
    const response = await getOwnGoods({ seller: req.user.id });
    res.status(200).json({
        status: 200,
        message: 'Successfully found your own goods!',
        data: response
    });
};

export const createGoodsController = async (req, res) => {
    const goods = {
        ...req.body,
        seller: req.user.id
    };
    const newGoods = await createGoods(goods);

    res.status(201).json({
        status: 201,
        message: 'Successfully created a goods!',
        data: newGoods
    });
};

export const patchGoodsController = async (req, res, next) => {
    const { id: goodsId } = req.params;
    const sellerId = req.user.id;
    
    const updatedGoods = await updateGoods(goodsId, sellerId, {...req.body});

    if (!updatedGoods) {
        throw createHttpError(404, 'Goods not found');
    }

    res.json({
        status: 200,
        message: 'Successfully patched a goods!',
        data: updatedGoods
    });
};

export const deleteGoodsController = async (req, res) => {
    const { id: goodsId } = req.params;
    const sellerId = req.user.id;
    const result = await deleteGoods(goodsId, sellerId);

    if (!result) {
        throw createHttpError(404, 'Goods not found');
    }

    res.status(204).send();
 };