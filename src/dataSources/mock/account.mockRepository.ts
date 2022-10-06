/* eslint-disable @typescript-eslint/no-unused-vars */
import { Account } from "../../entities/account.entity";
import { Profile } from "../../entities/profile.entity";
import { InternalServerError } from "../../errors";
import { IAccountRepository } from "../../repositories/account.repository";

class MockAccountRepository implements IAccountRepository {
    private now = new Date();
    private isNegativeScenario: boolean;
    private isSimulateError: boolean;

    mockAccount: Account = {
        id: "testaccountid",
        mobile: "+6282387654532",
        mobile_raw: "082387654532",
        email: "testaccount@mail.com",
        password: "testaccountpassword",
        created_at: this.now,
        updated_at: this.now,
    };

    constructor(isNegativeScenario: boolean, isSimulateError: boolean) {
        this.isNegativeScenario = isNegativeScenario;
        this.isSimulateError = isSimulateError;
    }

    checkExists(accountId: string): Promise<boolean> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error Simulated" })
            );

        if (this.isNegativeScenario) return Promise.resolve(true);

        if (accountId == this.mockAccount.id) return Promise.resolve(false);
        return Promise.resolve(false);
    }

    checkDuplicate(mobile: string, email: string): Promise<boolean> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error Simulated" })
            );

        if (this.isNegativeScenario) return Promise.resolve(true);

        // allow data that same as mockup data
        if (
            email == this.mockAccount.email ||
            mobile == this.mockAccount.mobile
        )
            return Promise.resolve(false);

        return Promise.resolve(true);
    }

    createAccount(account: Account, _profile: Profile): Promise<Account> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error Simulated" })
            );
        return Promise.resolve({
            ...account,
            id: this.mockAccount.id,
            created_at: this.mockAccount.created_at,
        });
    }

    getAccountByEmailOrMobile(emailOrMobile: string): Promise<Account | null> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error Simulated" })
            );
        if (this.isNegativeScenario) return Promise.resolve(null);

        if (
            emailOrMobile !== this.mockAccount.email &&
            emailOrMobile !== this.mockAccount.mobile &&
            emailOrMobile !== this.mockAccount.mobile_raw
        ) {
            return Promise.resolve(null);
        }
        return Promise.resolve(this.mockAccount);
    }

    getAccountById(accountId: string): Promise<Account | null> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error Simulated" })
            );
        if (this.isNegativeScenario) return Promise.resolve(null);

        if (accountId == this.mockAccount.id)
            return Promise.resolve(this.mockAccount);
        return Promise.resolve(null);
    }

    updateAccount(
        _accountId: string,
        _newAccount: Partial<Account>
    ): Promise<Account> {
        if (this.isSimulateError)
            new InternalServerError({ message: "Error Simulated" });
        return Promise.resolve(this.mockAccount);
    }

    deleteAccount(_accountId: string): Promise<void> {
        if (this.isSimulateError)
            new InternalServerError({ message: "Error Simulated" });
        return Promise.resolve();
    }
}

export { MockAccountRepository };
