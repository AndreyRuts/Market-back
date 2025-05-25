import mongoose from "mongoose";
import { Goods } from "../models/goodsItem.js";

export const getAllGoods = async ({ page, perPage, sortBy, sortOrder, filters }) => {
    const skip = page > 0 ? (page - 1) * perPage : 0;
    let allGoodsQuery = Goods.find(filters);
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    
    const [totalItems, data] = await Promise.all([
        Goods.countDocuments(filters),
        allGoodsQuery
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(perPage)
    ]);
    const totalPages = Math.ceil(totalItems / perPage);

    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: totalPages - page > 0
    };
};

export const getGoodsById = async (goodsId) => {
    return Goods.findById(goodsId);
};

export const getOwnGoods = async ({ seller, page, perPage, sortBy, sortOrder, filters }) => {
    const sellerId = new mongoose.Types.ObjectId(seller);
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const finalFilters = {
        ...filters,
        seller: sellerId
    };

    const goodsQuery = Goods.find(finalFilters);

    const [totalItems, data] = await Promise.all([
        Goods.countDocuments(finalFilters),
        goodsQuery
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(perPage)
    ]);

    const totalPages = Math.ceil(totalItems / perPage);

    return {
        data,
        page,
        perPage,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: totalPages - page > 0
    };
};

export const createGoods = async (payload) => {
    const goodsData = await Goods.create(payload);
    return goodsData;
};

export const updateGoods = async (goodsId, sellerId, payload) => {
    return await Goods.findOneAndUpdate(
        { _id: goodsId, seller: sellerId },
        payload,
        { new: true }
    );
};

export const deleteGoods = async (goodsId, sellerId) => {
    return await Goods.findOneAndDelete({ _id: goodsId, seller: sellerId });
};