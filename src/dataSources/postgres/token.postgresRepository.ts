import type { PrismaClient } from "@prisma/client";
import { Token } from "../../entities/token.entity";
import { ITokenRepository } from "../../repositories/token.repository";
import { InternalServerError } from "../../errors";

class PostgresTokenRepository implements ITokenRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async checkExists(accountId: string): Promise<boolean> {
        try {
            const isExists =
                (await this.prisma.token.count({
                    where: { account_id: accountId },
                })) == 1;

            return isExists;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async createToken(token: Token): Promise<Token> {
        try {
            const { account_id, ...tokenData } = token;
            const createdToken = await this.prisma.token.create({
                data: {
                    ...tokenData,
                    account: { connect: { id: account_id } },
                },
            });

            return createdToken;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async getToken(tokenId: string): Promise<Token | null> {
        try {
            const token = await this.prisma.token.findUnique({
                where: {
                    id: tokenId,
                },
            });

            return token;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async deleteToken(tokenId: string): Promise<void> {
        try {
            await this.prisma.token.delete({ where: { id: tokenId } });
            return;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async deleteTokenByAccount(accountId: string): Promise<void> {
        try {
            await this.prisma.token.delete({
                where: { account_id: accountId },
            });
            return;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }
}

export { PostgresTokenRepository };
