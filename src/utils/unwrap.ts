import { Result } from './result';

export async function unwrap<TResult, TError = Error>(promise: Promise<TResult>): Promise<[TResult, TError]> {
    try {
        const result = await promise;

        return [result, undefined];
    } catch (error) {
        return [undefined, <TError>error];
    }
}

export async function unwrapIntoResult<TResult, TError = Error>(
    promise: Promise<TResult>,
): Promise<Result<TResult, TError>> {
    try {
        const result = await promise;

        return Result.fromValue(result);
    } catch (error) {
        return Result.fromError(<TError>error);
    }
}
