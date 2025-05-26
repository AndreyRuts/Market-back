import mongoose from "mongoose";

import { Order } from "../models/order.js";
import { Goods } from "../models/goodsItem.js";

export const createOrder = async ({ buyerId, items, deliveryAddress, comments }) => {
    const buyer = buyerId;
    console.log('buyer used in create:', buyer);
    const productIds = items.map(i => i.product);
    const goodsList = await Goods.find({ _id: { $in: productIds } });

    let totalPrice = 0;
    for (const item of items) {
        const product = goodsList.find(g => g._id.toString() === item.product);
        if (!product) throw new Error(`Product with such id ${item.product} not found`);
        if (product.quantity < item.quantity) throw new Error(`Not enough products "${product.title}"`);

        totalPrice += product.price * item.quantity;
    }

    const orderedItems = items.map(item => {
        const product = goodsList.find(p => p._id.toString() === item.product);
        return {
            product: product._id,
            title: product.title,
            price: product.price,
            quantity: item.quantity,
            image: product.images?.[0]?.url || '',
        };
    });

    const newOrder = await Order.create({
        buyer,
        items: orderedItems,
        totalPrice,
        deliveryAddress,
        comments,
        status: 'pending',
    });

    const writeOffGoods = items.map(item => ({
        updateOne: {
            filter: { _id: item.product },
            update: { $inc: { quantity: -item.quantity } }
        }
    }));
    await Goods.bulkWrite(writeOffGoods);

    return newOrder;
};

export const getOwnOrders = async ({ buyerId, page, perPage, sortBy, sortOrder }) => {
    const buyer = new mongoose.Types.ObjectId(buyerId);
    const skip = page > 0 ? (page - 1) * perPage : 0;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [totalItems, data] = await Promise.all([
        Order.countDocuments({ buyer }),
        Order.find({ buyer })
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