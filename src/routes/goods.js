import { Router } from "express";

import {
    getAllGoodsController,
    getGoodsByIdController,
    getCategoriesController
} from "../controllers/goods.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { isValidID } from "../middlewares/isValidId.js";

const goodsRouter = Router();

goodsRouter.get('/', ctrlWrapper(getAllGoodsController));
goodsRouter.get('/categories', ctrlWrapper(getCategoriesController));
goodsRouter.get('/:id', isValidID, ctrlWrapper(getGoodsByIdController));

export default goodsRouter;