import { FastifySchema } from "fastify";

const registerValidator: FastifySchema = {
    body: {
        type: "object",
        required: ["mobile", "email", "password"],
        properties: {
            email: {
                type: "string",
                format: "email",
            },
            mobile: {
                type: "string",
                minLength: 11,
            },
            password: {
                type: "string",
                minLength: 8,
            },
        },
    },
};

const loginValidator: FastifySchema = {
    body: {
        type: "object",
        required: ["password"],
        properties: {
            mobile: {
                type: "string",
                minLength: 10,
                nullable: true,
            },
            email: {
                type: "string",
                format: "email",
                nullable: true,
            },
            password: {
                type: "string",
                minLength: 8,
            },
        },
    },
};

export { registerValidator, loginValidator };
