"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRole = hasRole;
function hasRole(user, required) {
    return user.roles.includes(required);
}
