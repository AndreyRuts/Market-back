import { initMongoConnection } from "./db/initMongoConnection.js";
import { serverSetup } from "./server.js";

const bootstrap = async () => {
    await initMongoConnection();
    serverSetup();
};

bootstrap();