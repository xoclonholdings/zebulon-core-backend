export type Role = 'admin' | 'maintainer' | 'user' | 'viewer';
export declare function hasRole(user: {
    roles: Role[];
}, required: Role): boolean;
