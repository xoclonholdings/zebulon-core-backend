"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var child_process_1 = require("child_process");
var path_1 = require("path");
// Load .env and check required secrets
var envPath = path_1.default.resolve(process.cwd(), '.env');
dotenv_1.default.config({ path: envPath });
var REQUIRED_SECRETS = [
    'DATABASE_URL',
    // Add more as needed
];
var missing = REQUIRED_SECRETS.filter(function (k) { return !process.env[k]; });
if (missing.length) {
    console.error('Missing required secrets:', missing);
    process.exit(1);
}
console.log('All required secrets present.');
// Run Prisma migrate diff → migrate deploy (no destructive reset)
try {
    (0, child_process_1.execSync)('pnpm exec prisma migrate deploy', { stdio: 'inherit' });
}
catch (e) {
    console.error('Prisma migration failed.');
    process.exit(1);
}
// Register and verify each template in order
var templates = [
    '01-universal-app',
    '02-data-automation',
    '03-commerce-payments',
    '04-notifications-reporting',
    '05-media-location',
];
for (var _i = 0, templates_1 = templates; _i < templates_1.length; _i++) {
    var t = templates_1[_i];
    var modPath = "../templates/zync/".concat(t, "/index");
    var mod = require(modPath);
    try {
        if (mod.register) {
            console.log("Registering ".concat(t, "..."));
            await mod.register();
        }
        if (mod.verify) {
            console.log("Verifying ".concat(t, "..."));
            await mod.verify();
        }
        console.log("".concat(t, " installed and verified."));
    }
    catch (err) {
        console.error("".concat(t, " failed:"), err);
        // TODO: Rollback logic for this template
        process.exit(1);
    }
}
console.log('ZYNC install complete.');
// TODO: Output summary table, health, docs, admin, tools enabled
