import fs from 'node:fs/promises';
import path from 'node:path';

import { getEnvVar } from './getEnvVar.js';
import { uploadToCloudinary } from './uploadToCloudinary.js';

export const processUploadedFiles = async (files) => {
    const images = [];
    const uploadToCloud = getEnvVar('UPLOAD_TO_CLOUDINARY') === 'true';

    for (const file of files) {
        if (uploadToCloud) {
            const result = await uploadToCloudinary(file.path);
            images.push({
                public_id: result.public_id,
                url: result.secure_url
            });
            await fs.unlink(file.path);
        } else {
            const destinationPath = path.resolve('src', 'uploads', file.filename);
            await fs.rename(file.path, destinationPath);
            images.push({
                public_id: null,
                url: `http://localhost:3000/uploads/${file.filename}`
            });
        }
    }
    return images;
};