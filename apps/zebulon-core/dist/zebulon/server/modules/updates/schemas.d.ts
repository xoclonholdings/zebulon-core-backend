export declare const ajv: any;
export declare const updateEnvelopeSchema: {
    readonly type: "object";
    readonly required: readonly ["tile", "action", "payload", "idempotencyKey"];
    readonly additionalProperties: false;
    readonly properties: {
        readonly tile: {
            readonly enum: readonly ["zed", "zeta", "zlab", "zwap", "zync", "zulu"];
        };
        readonly action: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly payload: {
            readonly type: "object";
        };
        readonly idempotencyKey: {
            readonly type: "string";
            readonly minLength: 16;
            readonly maxLength: 128;
        };
        readonly dryRun: {
            readonly type: "boolean";
        };
    };
};
export declare const actionSchemas: Record<string, any>;
export declare function validateAction(tile: string, action: string, payload: any): {
    ok: boolean;
    error: `Unknown action schema: ${string}`;
} | {
    ok: boolean;
    error: `Payload validation failed: ${any}`;
} | {
    ok: true;
    error?: undefined;
};
