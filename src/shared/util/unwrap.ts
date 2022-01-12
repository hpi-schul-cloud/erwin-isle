import { Result } from './result';

export async function unwrapIntoResult<T>(promise: Promise<T>): Promise<Result<T>> {
    try {
        const result = await promise;

        return { success: true, value: result };
    } catch (error) {
        return { success: false, error: error as Error };
    }
}
