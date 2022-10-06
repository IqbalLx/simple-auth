import { AccountMapper } from "../../entities/account.entity";
import { TokenMapper } from "../../entities/token.entity";
import { authService } from "../../services/auth";
import { AuthController } from "./auth.controller";

const authController = new AuthController(
    authService,
    AccountMapper,
    TokenMapper
);

export { authController };
