import { AuthRouter } from "./auth.router";
import { IRouter } from "./router.interface";

const authRouter = new AuthRouter();

const routers: IRouter[] = [authRouter];

export { routers };
