import { Config } from "../../config";
import {
    postgresAccountRepository,
    postgresTokenRepository,
} from "../../dataSources/postgres";
import { nativeDateUtils } from "../../utils/date.utils";
import { bcryptHashUtils } from "../../utils/hash.utils";
import { phoneNumberFormatter } from "../../utils/phoneNumber.util";
import { cryptoRandStrGen } from "../../utils/randomStringGenerator.utils";
import { AuthService } from "./auth.service";

const authService = new AuthService(
    Config,
    postgresAccountRepository,
    postgresTokenRepository,
    bcryptHashUtils,
    cryptoRandStrGen,
    nativeDateUtils,
    phoneNumberFormatter
);

export { authService };
export type { IAuthService } from "./auth.interface";
