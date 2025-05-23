import express from 'express';

import rootRouter from './routes/index.js';
import { getEnvVar } from './utils/getEnvVar.js';

const PORT = Number(getEnvVar('PORT', '3000'));
const app = express();

app.use(express.json());

export const serverSetup = () => {
    app.use(rootRouter);
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        
    });
};