import { Token } from "../entities/token.entity";

interface ITokenRepository {
    checkExists(accountId: string): Promise<boolean>;
    createToken(token: Token): Promise<Token>;
    getToken(tokenId: string): Promise<Token | null>;
    deleteToken(tokenId: string): Promise<void>;
    deleteTokenByAccount(accountId: string): Promise<void>;
}

export type { ITokenRepository };
