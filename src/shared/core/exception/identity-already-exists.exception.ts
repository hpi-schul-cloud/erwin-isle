export class IdentityAlreadyExistException extends Error {
    public constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, IdentityAlreadyExistException.prototype);
    }
}
