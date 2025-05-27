import mongoose from "mongoose";
import Handlebars from "handlebars";

import { Order } from "../models/order.js";
import { Goods } from "../models/goodsItem.js";

import { sendEmail } from '../utils/sendEmail.js';
import {
    ORDER_NOTIFICATION_TEMPLATE,
    EMAIL_SUBJECTS
} from "../constants/constants.js";

export const createOrder = async ({ buyerId, items, deliveryAddress, comments }) => {
    const buyer = buyerId;
    const productIds = items.map(i => i.product);
    const goodsList = await Goods.find({ _id: { $in: productIds } }).populate('seller');
    let totalPrice = 0;

    for (const item of items) {
        const product = goodsList.find(p => p._id.toString() === item.product);
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
            seller: product.seller._id
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

    const template = Handlebars.compile(ORDER_NOTIFICATION_TEMPLATE);
    const sellerMap = new Map();

    for (const item of orderedItems) {
        const product = goodsList.find(p => p._id.toString() === item.product.toString());
        const seller = product.seller;

        if (!sellerMap.has(seller._id.toString())) {
            sellerMap.set(seller._id.toString(), {
                seller,
                items: []
            });
        }
        sellerMap.get(seller._id.toString()).items.push(item);
    }

    for (const { seller, items } of sellerMap.values()) {
        const html = template({
            name: seller.name,
            items,
            deliveryAddress,
            comments
        });

        await sendEmail(
            seller.email,
            EMAIL_SUBJECTS.orderNotification,
            html
        );
    }

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