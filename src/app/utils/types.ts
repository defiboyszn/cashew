export type AccountValidationSchema = {
    username: string;
    password: string;
    confirmPassword: string;
}

export interface NetworkConfig {
    readonly id: number;
    readonly name: string;
    readonly nativeCurrency: { readonly decimals: number; readonly name: string; readonly symbol: string };
    readonly rpcUrls: {
        readonly default: { readonly http: readonly string[] };
        // readonly public: { readonly http: readonly string[] };
    };
}
