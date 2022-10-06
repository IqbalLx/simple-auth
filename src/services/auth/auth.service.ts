import { Config } from "../../config";
import { Account } from "../../entities/account.entity";
import { Profile } from "../../entities/profile.entity";
import { Token } from "../../entities/token.entity";
import { InternalServerError, ClientError } from "../../errors";
import { IAccountRepository } from "../../repositories/account.repository";
import { ITokenRepository } from "../../repositories/token.repository";
import { IDateUtils } from "../../utils/date.utils";
import { IHashUtils } from "../../utils/hash.utils";
import { IPhoneNumberUtils } from "../../utils/phoneNumber.util";
import { IRandomStringGenerator } from "../../utils/randomStringGenerator.utils";
import { IAuthService } from "./auth.interface";

class AuthService implements IAuthService {
    private accountRepo: IAccountRepository;
    private tokenRepo: ITokenRepository;
    private hashUtil: IHashUtils;
    private randStrGen: IRandomStringGenerator;
    private dateUtil: IDateUtils;
    private phoneNumUtil: IPhoneNumberUtils;
    private config: typeof Config;

    constructor(
        config: typeof Config,
        accountRepo: IAccountRepository,
        tokenRepo: ITokenRepository,
        hashUtil: IHashUtils,
        randStrGen: IRandomStringGenerator,
        dateUtil: IDateUtils,
        phoneNumUtil: IPhoneNumberUtils
    ) {
        this.config = config;
        this.accountRepo = accountRepo;
        this.tokenRepo = tokenRepo;
        this.hashUtil = hashUtil;
        this.randStrGen = randStrGen;
        this.dateUtil = dateUtil;
        this.phoneNumUtil = phoneNumUtil;
    }

    async register(
        account: Omit<Account, "mobile">,
        profile: Profile
    ): Promise<Account> {
        try {
            const isValidMobile = this.phoneNumUtil.isValidNumber(
                account.mobile_raw
            );
            if (!isValidMobile)
                throw new ClientError({
                    code: 422,
                    message: "phone number not valid ID mobile",
                });

            const standardizePhoneNumber = this.phoneNumUtil.getNumber(
                account.mobile_raw
            );
            const isAccountExists = await this.accountRepo.checkDuplicate(
                standardizePhoneNumber,
                account.email
            );
            if (isAccountExists)
                throw new ClientError({
                    code: 409,
                    message: "account already exists",
                });

            const hashedPassword = await this.hashUtil.hash(account.password);
            account.password = hashedPassword;

            const newAccount: Account = {
                ...account,
                mobile: standardizePhoneNumber,
            };

            return this.accountRepo.createAccount(newAccount, profile);
        } catch (error) {
            if (
                !(error instanceof InternalServerError) &&
                !(error instanceof ClientError)
            ) {
                console.error(error);
                throw new InternalServerError({
                    message: (error as Error).message,
                    errors: (error as Error).stack,
                });
            }
            throw error;
        }
    }

    async login(emailOrMobile: string, password: string): Promise<Token> {
        try {
            const account = await this.accountRepo.getAccountByEmailOrMobile(
                emailOrMobile
            );
            if (account === null)
                throw new ClientError({
                    code: 401,
                    message: "authentication error",
                });

            const isPasswordValid = await this.hashUtil.compare(
                password,
                account.password
            );
            if (!isPasswordValid)
                throw new ClientError({
                    code: 401,
                    message: "authentication error",
                });

            // avoid duplicated token, user can't login from more than one session
            const isTokenExists = await this.tokenRepo.checkExists(account.id!);
            if (isTokenExists)
                await this.tokenRepo.deleteTokenByAccount(account.id!);

            const rawTokenValue = this.randStrGen.generate(32);
            const hashedTokenValue = await this.hashUtil.hash(rawTokenValue);

            const createdToken = await this.tokenRepo.createToken({
                account_id: account.id!,
                value: hashedTokenValue,
                expires_at: this.dateUtil.addDaysToDate(
                    this.config.authTokenTTL
                ),
            });

            return {
                ...createdToken,
                value: rawTokenValue,
            };
        } catch (error) {
            if (
                !(error instanceof InternalServerError) &&
                !(error instanceof ClientError)
            ) {
                console.error(error);
                throw new InternalServerError({
                    message: (error as Error).message,
                    errors: (error as Error).stack,
                });
            }
            throw error;
        }
    }

    async verifyToken(tokenId: string, tokenValue: string): Promise<boolean> {
        try {
            const token = await this.tokenRepo.getToken(tokenId);
            if (token === null) return false;

            const isExpired = this.dateUtil.isDateAAfterDateB(
                new Date(),
                token.expires_at
            );
            if (isExpired) return false;

            const isValid = await this.hashUtil.compare(
                tokenValue,
                token.value
            );
            if (!isValid) return false;

            return true;
        } catch (error) {
            if (
                !(error instanceof InternalServerError) &&
                !(error instanceof ClientError)
            ) {
                console.error(error);
                throw new InternalServerError({
                    message: (error as Error).message,
                    errors: (error as Error).stack,
                });
            }
            throw error;
        }
    }

    async getToken(tokenId: string): Promise<Token> {
        try {
            const token = await this.tokenRepo.getToken(tokenId);
            if (token == null)
                throw new ClientError({
                    code: 404,
                    message: "token not found",
                });
            return token;
        } catch (error) {
            if (
                !(error instanceof InternalServerError) &&
                !(error instanceof ClientError)
            ) {
                console.error(error);
                throw new InternalServerError({
                    message: (error as Error).message,
                    errors: (error as Error).stack,
                });
            }
            throw error;
        }
    }

    logout(tokenId: string): Promise<void> {
        try {
            return this.tokenRepo.deleteToken(tokenId);
        } catch (error) {
            if (
                !(error instanceof InternalServerError) &&
                !(error instanceof ClientError)
            ) {
                console.error(error);
                throw new InternalServerError({
                    message: (error as Error).message,
                    errors: (error as Error).stack,
                });
            }
            throw error;
        }
    }
}

export { AuthService };
