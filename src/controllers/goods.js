import createHttpError from 'http-errors';

import {
    getAllGoods,
    getOwnGoods,
    createGoods,
    getGoodsById,
    updateGoods,
    deleteGoods
} from "../services/goods.js";

import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { processUploadedFiles } from '../utils/processUploadedFiles.js';
import { ALLOWED_CATEGORIES } from '../constants/constants.js';


export const getAllGoodsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filters = parseFilterParams(req.query);
    const response = await getAllGoods({
        page,
        perPage,
        sortBy,
        sortOrder,
        filters
    });
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
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filters = parseFilterParams(req.query);
    const response = await getOwnGoods({
        seller: req.user.id,
        page,
        perPage,
        sortBy,
        sortOrder,
        filters
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully found your own goods!',
        data: response
    });
};

export const createGoodsController = async (req, res) => {
    let images = [];

    if (req.files && req.files.length > 0) {
        images = await processUploadedFiles(req.files);
    }
  
    const goods = {
        ...req.body,       
        seller: req.user.id,    
        images     
    };
  
    const newGoods = await createGoods(goods);
  
    res.status(201).json({
        status: 201,  
        message: 'Successfully created a goods!',
        data: newGoods
    });
};

export const patchGoodsController = async (req, res) => {
    const { id: goodsId } = req.params;
    const sellerId = req.user.id;
  
    const existingGoods = await getGoodsById(goodsId);
  
    if (!existingGoods) {
        throw createHttpError(404, 'Goods not found');
    }
  
    const existingImages = existingGoods.images || [];
    let newImages = [];
  
    if (req.files && req.files.length > 0) {
        newImages = await processUploadedFiles(req.files);
    }

    const updatedData = {
        ...req.body,
        images: [...existingImages, ...newImages],
    };
  
    const updatedGoods = await updateGoods(goodsId, sellerId, updatedData);
  
    res.status(200).json({
        status: 200,
        message: 'Successfully patched a goods!',
        data: updatedGoods,
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

export const getCategoriesController = async (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'Category list retrieved successfully',
        data: ALLOWED_CATEGORIES
    });
};