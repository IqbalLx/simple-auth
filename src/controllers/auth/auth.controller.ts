import type { FastifyRequest, FastifyReply } from "fastify";
import { ClientError, InternalServerError } from "../../errors";
import { IAuthService } from "../../services/auth";
import { responseHandler } from "../../utils/response.utils";
import { AccountMapper } from "../../entities/account.entity";
import { Profile } from "../../entities/profile.entity";
import { TokenMapper } from "../../entities/token.entity";

class AuthController {
    private authService: IAuthService;
    private accountMapper: typeof AccountMapper;
    private tokenMapper: typeof TokenMapper;

    constructor(
        authService: IAuthService,
        accountMapper: typeof AccountMapper,
        tokenMapper: typeof TokenMapper
    ) {
        this.authService = authService;
        this.accountMapper = accountMapper;
        this.tokenMapper = tokenMapper;
    }

    registerController() {
        return async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const {
                    mobile,
                    email,
                    password,
                    first_name,
                    last_name,
                    dob,
                    gender,
                } = request.body as {
                    [key: string]: string;
                } & Profile;

                const account = await this.authService.register(
                    {
                        email,
                        password,
                        mobile_raw: mobile,
                    },
                    {
                        first_name,
                        last_name,
                        dob,
                        gender,
                    }
                );

                const accountDPO = this.accountMapper.convertToDPO(account);

                return responseHandler({
                    reply,
                    status: 201,
                    message: "success",
                    content: accountDPO,
                });
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

    loginController() {
        return async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const { mobile, email, password } = request.body as {
                    mobile?: string;
                    email?: string;
                    password: string;
                };

                const identifier = mobile ?? email;
                if (identifier == undefined)
                    throw new ClientError({
                        code: 422,
                        message: "either mobile or email is required",
                    });

                const token = await this.authService.login(
                    identifier,
                    password
                );

                const tokenDPO = this.tokenMapper.convertToDPO(token);

                return responseHandler({
                    reply,
                    status: 200,
                    message: "success",
                    content: tokenDPO,
                });
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

    logoutController() {
        return async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                const token = request.token!;

                await this.authService.logout(token.id!);

                return responseHandler({
                    reply,
                    status: 200,
                    message: "success",
                });
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

export { AuthController };
