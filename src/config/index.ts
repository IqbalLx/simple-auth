import { readEnv as env } from "../utils/readEnv.utils";

class Config {
    private static parseOrigin(origins: string) {
        return origins.split(",");
    }

    // environment
    static environment = env.get("NODE_ENV");
    static isDevelopment = env.get("NODE_ENV") == "DEVELOPMENT";
    static isTest = env.get("NODE_ENV") == "TEST";
    static isStaging = env.get("NODE_ENV") == "STAGING";
    static isProduction = env.get("NODE_ENV") == "PRODUCTION";

    // data sources
    static databaseUrl = Config.isTest ? "" : env.get("DATABASE_URL");

    // app setting
    static port = Number(env.get("PORT", "3000"));
    static origins: string[] = Config.parseOrigin(
        env.get("ALLOWED_ORIGINS", "http://localhost")
    );

    // auth setting
    static authTokenTTL = Number(env.get("AUTH_TOKEN_TTL", "30")); // days
}

export { Config };
