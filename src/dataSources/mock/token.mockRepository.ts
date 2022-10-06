/* eslint-disable @typescript-eslint/no-unused-vars */
import { Token } from "../../entities/token.entity";
import { InternalServerError } from "../../errors";
import { ITokenRepository } from "../../repositories/token.repository";

class MockTokenRepository implements ITokenRepository {
    private isNegativeScenario: boolean;
    private isSimulateError: boolean;

    private now = new Date();
    private weekLater = new Date();

    validMockToken: Token;
    expiredMockToken: Token;

    constructor(isNegativeScenario: boolean, isSimulateError: boolean) {
        this.isNegativeScenario = isNegativeScenario;
        this.isSimulateError = isSimulateError;

        this.weekLater.setDate(this.weekLater.getDate() + 7);
        this.validMockToken = {
            id: "testtokenid",
            account_id: "testaccountid",
            value: "testtokenvalidvalue",
            expires_at: this.weekLater,
            created_at: this.now,
        };

        this.expiredMockToken = {
            id: "testtokenid",
            account_id: "testaccountid",
            value: "testtokenexpiredvalue",
            expires_at: this.now,
            created_at: this.now,
        };
    }

    checkExists(_accountId: string): Promise<boolean> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error simulated" })
            );

        if (this.isNegativeScenario) return Promise.resolve(false);
        return Promise.resolve(true);
    }

    createToken(_token: Token): Promise<Token> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error simulated" })
            );

        return Promise.resolve(this.validMockToken);
    }

    getToken(_tokenId: string): Promise<Token | null> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error simulated" })
            );
        if (this.isNegativeScenario)
            return Promise.resolve(this.expiredMockToken);
        return Promise.resolve(this.validMockToken);
    }

    deleteToken(_tokenId: string): Promise<void> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error simulated" })
            );
        return Promise.resolve();
    }

    deleteTokenByAccount(_tokenId: string): Promise<void> {
        if (this.isSimulateError)
            return Promise.reject(
                new InternalServerError({ message: "Error simulated" })
            );
        return Promise.resolve();
    }
}

export { MockTokenRepository };
