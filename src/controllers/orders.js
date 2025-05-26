// import createHttpError from "http-errors";

import {
    createOrder,
    getOwnOrders
} from "../services/orders.js";

import { parseSortParams } from "../utils/parseSortParams.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";


export const createOrderController = async (req, res) => {
    const buyerId = req.user.id;
    console.log('buyerId from controller:', buyerId);
    const { items, deliveryAddress, comments } = req.body;

    const newOrder = await createOrder({
        buyerId,
        items,
        deliveryAddress,
        comments,
    });

    res.status(201).json({
        status: 201,
        message: 'Order created successfully!',
        data: newOrder,
    });
};

export const getOwnOrdersController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const buyerId = req.user.id;

    const response = await getOwnOrders({
        buyerId,
        page,
        perPage,
        sortBy,
        sortOrder,
    });
    res.status(200).json({
        status: 200,
        message: "Successfully retrieved your orders!",
        data: response,
    });
};