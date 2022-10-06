import { App } from "./app";
import { Config } from "./config";
import { routers } from "./routers";

const app = new App(Config, routers);
await app.listen();
