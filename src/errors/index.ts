class ClientError extends Error {
    public code: number;
    public errors?: string;

    constructor({
        message,
        errors,
        code = 400,
    }: {
        message: string;
        errors?: string;
        code?: number;
    }) {
        super(message);
        this.code = code;
        this.errors = errors;
        this.name = this.constructor.name;
    }
}

class InternalServerError extends Error {
    public code: number;
    public errors?: string;

    constructor({
        message,
        errors,
        code = 500,
    }: {
        message: string;
        errors?: string;
        code?: number;
    }) {
        super(message);
        this.code = code;
        this.errors = errors;
        this.name = this.constructor.name;
    }
}

export { ClientError, InternalServerError };
