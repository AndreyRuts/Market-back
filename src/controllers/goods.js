import * as fs from 'node:fs/promises';
import path from 'path';
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
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';


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
    const images = [];

    if (req.files && req.files.length > 0) {
        if (getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true') {       
            for (const file of req.files) {          
                const result = await uploadToCloudinary(file.path); 
                images.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
                await fs.unlink(file.path);
            }
        }
        else {
            for (const file of req.files) {           
                const destinationPath = path.resolve('src', 'uploads', file.filename);              
                await fs.rename(file.path, destinationPath);             
                images.push({                
                    public_id: null,                    
                    url: `http://localhost:3000/uploads/${file.filename}`                  
                });               
            }             
        }
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