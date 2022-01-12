export class Result<TResult, TError = Error> {
    private constructor(
        public readonly success: boolean,
        public readonly value: TResult,
        public readonly error: TError,
    ) {}

    public static fromValue<TResult, TError = Error>(value: TResult): Result<TResult, TError> {
        return new Result(true, value, undefined);
    }

    public static fromError<TResult, TError = Error>(error: TError): Result<TResult, TError> {
        return new Result(false, undefined, error);
    }
}
