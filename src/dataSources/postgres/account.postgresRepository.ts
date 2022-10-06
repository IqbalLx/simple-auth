import type { PrismaClient } from "@prisma/client";
import { Account } from "../../entities/account.entity";
import { Profile } from "../../entities/profile.entity";
import { InternalServerError } from "../../errors";
import { IAccountRepository } from "../../repositories/account.repository";

class PostgresAccountRepository implements IAccountRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async checkExists(accountId: string): Promise<boolean> {
        try {
            const isExists =
                (await this.prisma.account.count({
                    where: { id: accountId },
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

    async checkDuplicate(mobile: string, email: string): Promise<boolean> {
        try {
            const isDuplicated =
                (await this.prisma.account.count({
                    where: {
                        OR: [{ email }, { mobile_raw: mobile }],
                    },
                })) == 1;

            return isDuplicated;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async createAccount(account: Account, profile: Profile): Promise<Account> {
        try {
            const createdAccount = await this.prisma.account.create({
                data: {
                    ...account,
                    profile: {
                        create: profile,
                    },
                },
            });

            return createdAccount;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async getAccountByEmailOrMobile(
        emailOrMobile: string
    ): Promise<Account | null> {
        try {
            const account = await this.prisma.account.findFirst({
                where: {
                    OR: [
                        { mobile: emailOrMobile },
                        { email: emailOrMobile },
                        { mobile_raw: emailOrMobile },
                    ],
                },
            });

            return account;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async getAccountById(accountId: string): Promise<Account | null> {
        try {
            const account = await this.prisma.account.findUnique({
                where: {
                    id: accountId,
                },
            });

            return account;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async updateAccount(
        accountId: string,
        newAccount: Partial<Account>
    ): Promise<Account> {
        try {
            const updatedAccount = await this.prisma.account.update({
                where: {
                    id: accountId,
                },
                data: {
                    email: newAccount.email,
                    mobile: newAccount.mobile,
                    mobile_raw: newAccount.mobile_raw,
                },
            });

            return updatedAccount;
        } catch (error) {
            console.error(error);

            throw new InternalServerError({
                message: (error as Error).message,
                errors: (error as Error).stack,
            });
        }
    }

    async deleteAccount(accountId: string): Promise<void> {
        try {
            await this.prisma.account.delete({ where: { id: accountId } });
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

export { PostgresAccountRepository };
