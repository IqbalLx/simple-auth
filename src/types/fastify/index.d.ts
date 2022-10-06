import { Token } from "../../entities/token.entity";

declare module "fastify" {
    export interface FastifyRequest {
        token?: Token;
    }
}
