import { hash as bhash, compare as bcompare } from "bcrypt";
import { createHmac } from "crypto";
import { InternalServerError } from "../errors";
import { assertDefined } from "./nonNullAssertion.utils";

interface IHashUtils {
    hash(rawString: string, secret?: string): Promise<string>;
    compare(rawString: string, hashedString: string): Promise<boolean>;
}

class BcryptHashUtils implements IHashUtils {
    private salt: number;

    constructor(salt = 8) {
        this.salt = salt;
    }

    hash(rawString: string): Promise<string> {
        try {
            return bhash(rawString, this.salt);
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    compare(rawString: string, hashedString: string): Promise<boolean> {
        try {
            return bcompare(rawString, hashedString);
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }
}

class CryptoSHA256HashUtils implements Pick<IHashUtils, "hash"> {
    hash(rawString: string, secret?: string): Promise<string> {
        try {
            assertDefined(secret, "secret");
            const hmac = createHmac("sha256", secret);
            const data = hmac.update(rawString);

            return Promise.resolve(data.digest("hex"));
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }
}

const bcryptHashUtils = new BcryptHashUtils();
const cryptoSHA256HashUtils = new CryptoSHA256HashUtils();

export type { IHashUtils };
export { bcryptHashUtils, cryptoSHA256HashUtils };
