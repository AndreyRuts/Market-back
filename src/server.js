import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUIExpress from 'swagger-ui-express';
import path from 'node:path';
import * as fs from 'node:fs';

import rootRouter from './routes/index.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';


const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'));
const PORT = Number(getEnvVar('PORT', '3000'));
const app = express();

app.use('/api-docs', swaggerUIExpress.serve, swaggerUIExpress.setup(swaggerDocument));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(pino({
        transport: {
            target: 'pino-pretty',
        }
    }));

export const serverSetup = () => {
    app.use(rootRouter);
    app.use('*', notFoundHandler);
    app.use(errorHandler);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};