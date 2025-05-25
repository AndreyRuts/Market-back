import { Router } from 'express';
import {
  getOwnGoodsController,
  createGoodsController,
  patchGoodsController,
  deleteGoodsController
} from '../controllers/goods.js';

import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidID } from '../middlewares/isValidId.js';

import {
  goodsValidationSchema,
  goodsUpdateValidationSchema
} from '../validation/goods.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const ownGoodsRouter = Router();

ownGoodsRouter.use(authenticate);

ownGoodsRouter.get('/', ctrlWrapper(getOwnGoodsController));

ownGoodsRouter.post(
  '/',
  upload.array('images'),
  validateBody(goodsValidationSchema),
  ctrlWrapper(createGoodsController)
);

ownGoodsRouter.patch(
  '/:id',
  upload.array('images'),
  isValidID,
  validateBody(goodsUpdateValidationSchema),
  ctrlWrapper(patchGoodsController)
);

ownGoodsRouter.delete('/:id', isValidID, ctrlWrapper(deleteGoodsController));

export default ownGoodsRouter;