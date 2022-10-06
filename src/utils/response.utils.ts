import { Config } from "../config";
import type { FastifyReply } from "fastify";

function responseHandler({
    reply,
    status,
    content,
    message,
    errors,
}: {
    reply: FastifyReply;
    status: number;
    content?: unknown;
    message?: string;
    errors?: string;
}) {
    if (errors) {
        return reply.code(status).send({
            content: content ?? null,
            message,
            errors: Config.isProduction
                ? []
                : errors.split("\n").map((err) => err.trim()),
        });
    }

    return reply.code(status).send({
        content,
        message: message ?? "Success",
        errors: [],
    });
}

export { responseHandler };
