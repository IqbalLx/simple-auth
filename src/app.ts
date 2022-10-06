/* eslint-disable indent */
import Fastify, { FastifyInstance } from "fastify";
import { Config } from "./config";
import { IRouter } from "./routers/router.interface";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

class App {
    private config: typeof Config;
    private app: FastifyInstance;

    constructor(config: typeof Config, routers: IRouter[]) {
        this.config = config;
        this.app = Fastify({
            logger: this.config.isProduction
                ? true
                : {
                      transport: {
                          target: "pino-pretty",
                          options: {
                              translateTime: "HH:MM:ss Z",
                              ignore: "pid,hostname",
                          },
                      },
                  },
        });

        // register plugin
        this.app.register(cors, {
            origin: this.config.origins,
            methods: [
                "HEAD",
                "OPTION",
                "POST",
                "GET",
                "PATCH",
                "PUT",
                "DELETE",
            ],
        });
        this.app.register(helmet);

        this.registerRouters(routers);
    }

    private registerRouters(routers: IRouter[]): void {
        routers.forEach((router) =>
            this.app.register(router.routes, {
                prefix: `/api/v1/${router.prefixRouteName}`,
            })
        );

        this.app.get("/ping", async (_request, reply) => {
            return reply.code(200).send({ message: "PONG!" });
        });
    }

    async listen() {
        try {
            await this.app.listen({ port: this.config.port });
        } catch (err) {
            this.app.log.fatal({ msg: "Application startup error", err });
            process.exit(1);
        }
    }
}

export { App };
