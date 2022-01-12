export class IdentityAlreadyExistError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, IdentityAlreadyExistError.prototype);
    }
}
