import { PrismaClient } from "@prisma/client";
import { Config } from "../../config";
import { PostgresAccountRepository } from "./account.postgresRepository";
import { PostgresTokenRepository } from "./token.postgresRepository";

const prisma = new PrismaClient();

if (Config.isDevelopment) {
    prisma.$use(async (params, next) => {
        const before = Date.now();

        const result = await next(params);

        const after = Date.now();

        process.stdout.write(
            `Query ${params.model}.${params.action} took ${after - before}ms\n`
        );

        return result;
    });
}

await prisma.$connect();

const postgresAccountRepository = new PostgresAccountRepository(prisma);
const postgresTokenRepository = new PostgresTokenRepository(prisma);

export { postgresAccountRepository, postgresTokenRepository };
