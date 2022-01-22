declare global {
    namespace jest {
        interface Matchers<R> {
            toBeDisabled(): void;
        }
    }
}
export {};
