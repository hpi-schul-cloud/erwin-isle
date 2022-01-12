export class UserNotFoundException extends Error {
    public constructor() {
        super(`User not found.`);
        Object.setPrototypeOf(this, UserNotFoundException.prototype);
    }
}
