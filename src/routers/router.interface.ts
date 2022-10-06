import type {
    FastifyInstance,
    FastifyPluginOptions,
    HookHandlerDoneFunction,
} from "fastify";

interface IRouter {
    prefixRouteName: string;
    routes(
        fastify: FastifyInstance,
        _options: FastifyPluginOptions,
        done: HookHandlerDoneFunction
    ): void;
}

export type { IRouter };
