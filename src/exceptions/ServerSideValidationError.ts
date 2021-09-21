export interface ValidationErrorBody {
    [key: string]: string[]
}

export class ServerSideValidationError extends Error {
    public body: ValidationErrorBody;

    constructor(message: string, body: ValidationErrorBody) {
        super(message);
        this.body = body;
    }
}
