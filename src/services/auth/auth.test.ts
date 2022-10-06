/* eslint-disable @typescript-eslint/no-unused-vars */
import { Config } from "../../config";
import {
    MockAccountRepository,
    MockTokenRepository,
} from "../../dataSources/mock";
import { Account } from "../../entities/account.entity";
import { Profile } from "../../entities/profile.entity";
import { Token } from "../../entities/token.entity";
import { ClientError, InternalServerError } from "../../errors";
import { nativeDateUtils } from "../../utils/date.utils";
import { IHashUtils } from "../../utils/hash.utils";
import { phoneNumberFormatter } from "../../utils/phoneNumber.util";
import { IRandomStringGenerator } from "../../utils/randomStringGenerator.utils";
import { AuthService } from "./auth.service";

class MockHashUtil implements IHashUtils {
    private isNegativeScenario: boolean;

    constructor(isNegativeScenario: boolean) {
        this.isNegativeScenario = isNegativeScenario;
    }

    compare(_rawString: string, _hashedString: string): Promise<boolean> {
        if (this.isNegativeScenario) return Promise.resolve(false);
        return Promise.resolve(true);
    }

    hash(rawString: string, _secret?: string | undefined): Promise<string> {
        return Promise.resolve(rawString);
    }
}

class MockRandomStringGenerator implements IRandomStringGenerator {
    generate(length?: number | undefined): string {
        return "testrandomstring";
    }
}

const mockHashUtilValid = new MockHashUtil(false);
const mockHashUtilInvalid = new MockHashUtil(true);
const mockRandStrGen = new MockRandomStringGenerator();

const mockAccountRepositoryValid = new MockAccountRepository(false, false);
const mockAccountRepositoryInvalid = new MockAccountRepository(true, false);
const mockAccountRepositoryError = new MockAccountRepository(false, true);

const mockTokenRepositoryValid = new MockTokenRepository(false, false);
const mockTokenRepositoryInvalid = new MockTokenRepository(true, false);
const mockTokenRepositoryError = new MockTokenRepository(false, true);

const authServiceValid = new AuthService(
    Config,
    mockAccountRepositoryValid,
    mockTokenRepositoryValid,
    mockHashUtilValid,
    mockRandStrGen,
    nativeDateUtils,
    phoneNumberFormatter
);

const authServiceInvalid = new AuthService(
    Config,
    mockAccountRepositoryInvalid,
    mockTokenRepositoryInvalid,
    mockHashUtilInvalid,
    mockRandStrGen,
    nativeDateUtils,
    phoneNumberFormatter
);

const authServiceError = new AuthService(
    Config,
    mockAccountRepositoryError,
    mockTokenRepositoryError,
    mockHashUtilInvalid,
    mockRandStrGen,
    nativeDateUtils,
    phoneNumberFormatter
);

const mockAccount: Omit<Account, "mobile"> = {
    mobile_raw: "082387654532",
    email: "testaccount@mail.com",
    password: "testaccountpassword",
};

const mockAccountInvalid: Omit<Account, "mobile"> = {
    mobile_raw: "11111111111",
    email: "testaccount@mail.com",
    password: "testaccountpassword",
};

const mockProfile: Profile = {
    first_name: "Test",
    last_name: "Account",
};

describe("Auth Service Test - Valid Condition", () => {
    it("should successfully register account", async () => {
        const account = await authServiceValid.register(
            mockAccount,
            mockProfile
        );
        expect(account).toMatchObject<
            WithRequired<Account, "id" | "created_at" | "updated_at">
        >;
    });

    it("should successfully login", async () => {
        const tokenUsingMobileRaw = await authServiceValid.login(
            "082387654532",
            "testaccountpassword"
        );
        const tokenUsingMobile = await authServiceValid.login(
            "+6282387654532",
            "testaccountpassword"
        );
        const tokenUsingEmail = await authServiceValid.login(
            "testaccount@mail.com",
            "testaccountpassword"
        );

        expect(tokenUsingMobileRaw).toMatchObject<
            WithRequired<Token, "id" | "created_at">
        >;
        expect(tokenUsingMobile).toMatchObject<
            WithRequired<Token, "id" | "created_at">
        >;
        expect(tokenUsingEmail).toMatchObject<
            WithRequired<Token, "id" | "created_at">
        >;
    });

    it("should return token valid", async () => {
        const tokenUsingMobile = await authServiceValid.login(
            "082387654532",
            "testaccountpassword"
        );
        const isTokenValid = await authServiceValid.verifyToken(
            tokenUsingMobile.id!,
            tokenUsingMobile.value
        );

        expect(isTokenValid).toBe(true);
    });
});

describe("Auth Service Test - Client Fail Condition", () => {
    it("should failed register account - invalid mobile", async () => {
        expect(
            authServiceValid.register(mockAccountInvalid, mockProfile)
        ).rejects.toThrowError(ClientError);
    });

    it("should failed register account - pure client error", async () => {
        expect(
            authServiceInvalid.register(mockAccount, mockProfile)
        ).rejects.toThrowError(ClientError);
    });

    it("should failed login account", async () => {
        expect(
            authServiceInvalid.login("testaccount", "testaccountpassword")
        ).rejects.toThrowError(ClientError);
        expect(
            authServiceInvalid.login(
                "testaccount@mail.com",
                "testaccountpassword"
            )
        ).rejects.toThrowError(ClientError);
    });

    it("should return token invalid", async () => {
        const tokenUsingMobile = await authServiceValid.login(
            "082387654532",
            "testaccountpassword"
        );
        const isTokenValid = await authServiceInvalid.verifyToken(
            tokenUsingMobile.id!,
            tokenUsingMobile.value
        );

        expect(isTokenValid).toBe(false);
    });
});

describe("Auth Service Test - DB Fail Condition", () => {
    it("should failed register account", async () => {
        expect(
            authServiceError.register(mockAccount, mockProfile)
        ).rejects.toThrowError(InternalServerError);
    });

    it("should failed login account", async () => {
        expect(
            authServiceError.login("082387654532", "testaccountpassword")
        ).rejects.toThrowError(InternalServerError);
    });

    it("should error validating token", async () => {
        const tokenUsingMobile = await authServiceValid.login(
            "082387654532",
            "testaccountpassword"
        );

        expect(
            authServiceError.verifyToken(
                tokenUsingMobile.id!,
                tokenUsingMobile.value
            )
        ).rejects.toThrowError(InternalServerError);
    });

    it("should error logout", async () => {
        const tokenUsingMobile = await authServiceValid.login(
            "082387654532",
            "testaccountpassword"
        );

        expect(
            authServiceError.logout(tokenUsingMobile.id!)
        ).rejects.toThrowError(InternalServerError);
    });
});
