/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    FastifyInstance,
    RawServerDefault,
    FastifyBaseLogger,
    FastifyTypeProviderDefault,
    FastifyPluginOptions,
    HookHandlerDoneFunction,
} from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { authController } from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";
import {
    loginValidator,
    registerValidator,
} from "../validators/auth.validator";
import { IRouter } from "./router.interface";

class AuthRouter implements IRouter {
    prefixRouteName = "auth";

    routes(
        fastify: FastifyInstance<
            RawServerDefault,
            IncomingMessage,
            ServerResponse<IncomingMessage>,
            FastifyBaseLogger,
            FastifyTypeProviderDefault
        >,
        _options: FastifyPluginOptions,
        done: HookHandlerDoneFunction
    ): void {
        fastify.post(
            "/register",
            {
                schema: registerValidator,
            },
            authController.registerController()
        );

        fastify.post(
            "/login",
            {
                schema: loginValidator,
            },
            authController.loginController()
        );

        fastify.delete(
            "/logout",
            { preHandler: authMiddleware.verifyTokenMiddleware() },
            authController.logoutController()
        );

        done();
    }
}

export { AuthRouter };
