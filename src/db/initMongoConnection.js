import mongoose from "mongoose";

import { getEnvVar } from "../utils/getEnvVar.js";

const user = getEnvVar('MONGODB_USER');
const pwd = getEnvVar('MONGODB_PASSWORD');
const url = getEnvVar('MONGODB_URL');
const db = getEnvVar('MONGODB_DB');
const DB_ACCESS = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

export const initMongoConnection = async () => {
    try {
        await mongoose.connect(DB_ACCESS);
        console.log('Mongo connection successfully established!');
    } catch (error) {
        console.error('Error while setting up mongo connection', error);
        throw error;
    }
};