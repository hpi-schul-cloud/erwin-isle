export class CodeNotReachableException extends Error {
    public constructor() {
        super('This code should not be reachable.');
        Object.setPrototypeOf(this, CodeNotReachableException.prototype);
    }
}
