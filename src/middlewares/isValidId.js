import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export const isValidID = (req, res, next) => {
    const { id } = req.params;

    // Если id не передан — пропускаем дальше (он не обязателен)
    if (!id) {
        return next();
    }

    if (!isValidObjectId(id)) {
        console.log('isValidID middleware → invalid id:', id);
        return next(new createHttpError.BadRequest('ID is not valid'));
    }

    next();
};
