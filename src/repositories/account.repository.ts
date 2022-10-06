import { Account } from "../entities/account.entity";
import { Profile } from "../entities/profile.entity";

interface IAccountRepository {
    checkExists(accountId: string): Promise<boolean>;
    checkDuplicate(mobile: string, email: string): Promise<boolean>;
    createAccount(account: Account, profile: Profile): Promise<Account>;
    getAccountByEmailOrMobile(emailOrMobile: string): Promise<Account | null>;
    getAccountById(accountId: string): Promise<Account | null>;
    updateAccount(
        accountId: string,
        newAccount: Partial<Account>
    ): Promise<Account>;
    deleteAccount(accountId: string): Promise<void>;
}

export type { IAccountRepository };
