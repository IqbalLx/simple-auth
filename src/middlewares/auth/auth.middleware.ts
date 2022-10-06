import type {
    FastifyRequest,
    FastifyReply,
    HookHandlerDoneFunction,
} from "fastify";
import { ClientError, InternalServerError } from "../../errors";
import { IAuthService } from "../../services/auth";
import { responseHandler } from "../../utils/response.utils";

class AuthMiddleware {
    private authService: IAuthService;

    constructor(authService: IAuthService) {
        this.authService = authService;
    }

    verifyTokenMiddleware() {
        return async (
            request: FastifyRequest,
            reply: FastifyReply
        ): Promise<FastifyReply | void> => {
            try {
                const { authorization } = request.headers;

                if (!authorization)
                    throw new ClientError({
                        code: 401,
                        message: "no token provided",
                    });

                const tokenData: string = (authorization as string).split(
                    " "
                )[1];
                const [tokenId, tokenValue]: string[] = tokenData.split(".");

                const isTokenValid = await this.authService.verifyToken(
                    tokenId,
                    tokenValue
                );
                if (!isTokenValid)
                    throw new ClientError({
                        code: 401,
                        message: "invalid token",
                    });

                const token = await this.authService.getToken(tokenId);

                request.token = token;
            } catch (error) {
                if (
                    error instanceof ClientError ||
                    error instanceof InternalServerError
                ) {
                    return responseHandler({
                        reply,
                        status: error.code,
                        message: error.message,
                        errors: error.errors,
                    });
                }
                return responseHandler({
                    reply,
                    status: 500,
                    message: "internal server error",
                    errors: (error as Error).stack,
                });
            }
        };
    }
}

export { AuthMiddleware };
