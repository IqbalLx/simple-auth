export function assertDefined<T>(
    value: T | null | undefined,
    name?: string
): asserts value is T {
    if (value === null || value === undefined) {
        throw new Error(
            `fatal error: value ${name ?? "?"} must not be null/undefined.`
        );
    }
}
