// Shared RBAC lib
export type Role = 'admin' | 'maintainer' | 'user' | 'viewer';
export function hasRole(user: { roles: Role[] }, required: Role): boolean {
  return user.roles.includes(required);
}
