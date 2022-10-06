import { authService } from "../../services/auth";
import { AuthMiddleware } from "./auth.middleware";

const authMiddleware = new AuthMiddleware(authService);

export { authMiddleware };
