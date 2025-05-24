import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import rootRouter from './routes/index.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const PORT = Number(getEnvVar('PORT', '3000'));
const app = express();

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