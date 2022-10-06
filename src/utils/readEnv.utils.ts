import * as dotenv from "dotenv";

dotenv.config();

class ReadEnv {
    public get(envKey: string, optionalValue?: string): string {
        const envValue: string | undefined = process.env[envKey];
        if (envValue === undefined) {
            if (optionalValue) {
                return optionalValue;
            }

            throw new Error(
                `${envKey} value not found, please update your .env`
            );
        }

        return envValue;
    }
}

const readEnv = new ReadEnv();

export { readEnv };
