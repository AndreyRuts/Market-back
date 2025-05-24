import { Router } from "express";

import {
    getAllGoodsController,
    getOwnGoodsController,
    getGoodsByIdController,
    createGoodsController,
    patchGoodsController,
    deleteGoodsController
} from "../controllers/goods.js";


import { goodsValidationSchema, goodsUpdateValidationSchema } from "../validation/goods.js";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validateBody.js";

import { isValidID } from "../middlewares/isValidId.js";
import { upload } from "../middlewares/upload.js";


const goodsRouter = Router();

goodsRouter.get('/', ctrlWrapper(getAllGoodsController));
goodsRouter.get('/:id', isValidID, ctrlWrapper(getGoodsByIdController));

goodsRouter.use(authenticate);
goodsRouter.get('/own', ctrlWrapper(getOwnGoodsController));
goodsRouter.post(
    '/',
    upload.single('photo'),
    validateBody(goodsValidationSchema),
    ctrlWrapper(createGoodsController)
);
goodsRouter.patch(
    '/own/:id',
    upload.single('photo'),
    isValidID,
    validateBody(goodsUpdateValidationSchema),
    ctrlWrapper(patchGoodsController)
);
goodsRouter.delete('/own/:id', isValidID, ctrlWrapper(deleteGoodsController));

export default goodsRouter;