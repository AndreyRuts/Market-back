import mongoose from "mongoose";
import { Goods } from "../models/goodsItem.js";

export const getAllGoods = async (filter = {}) => {
    const allGoodsQuery = await Goods.find(filter);
    return allGoodsQuery;
};

export const getGoodsById = async (goodsId) => {
    return Goods.findById(goodsId);
};

export const getOwnGoods = async ({ seller }) => {
    const sellerId = new mongoose.Types.ObjectId(seller);
    const ownGoodsQuery = Goods.find({ seller: sellerId });
    return ownGoodsQuery;
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