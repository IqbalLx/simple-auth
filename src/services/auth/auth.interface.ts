import { Account } from "../../entities/account.entity";
import { Profile } from "../../entities/profile.entity";
import { Token } from "../../entities/token.entity";

interface IAuthService {
    register(
        account: Omit<Account, "mobile">,
        profile: Profile
    ): Promise<Account>;
    login(emailOrMobile: string, password: string): Promise<Token>;
    verifyToken(tokenId: string, tokenValue: string): Promise<boolean>;
    getToken(tokenId: string): Promise<Token>;
    logout(tokenId: string): Promise<void>;
}

export { IAuthService };
