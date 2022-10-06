import { v4 } from "uuid";
import crypto from "crypto";

interface IRandomStringGenerator {
    generate(length?: number): string;
}

class UUIDRandomStringGenerator implements IRandomStringGenerator {
    generate(): string {
        return v4();
    }
}

class CryptoRandomStringGenerator implements IRandomStringGenerator {
    generate(length?: number): string {
        return crypto
            .randomBytes(length ? Math.floor(length / 2) : 16)
            .toString("hex");
    }
}

const uuidRandStrGen = new UUIDRandomStringGenerator();
const cryptoRandStrGen = new CryptoRandomStringGenerator();

export type { IRandomStringGenerator };
export { uuidRandStrGen, cryptoRandStrGen };
