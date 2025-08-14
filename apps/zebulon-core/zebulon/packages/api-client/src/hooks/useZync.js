"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZync = useZync;
var react_1 = require("react");
var index_1 = require("../index");
function useZync(getToken) {
    var api = new index_1.Api(process.env.NEXT_PUBLIC_ZYNC_API, getToken);
    var _a = (0, react_1.useState)([]), repos = _a[0], setRepos = _a[1];
    var _b = (0, react_1.useState)([]), builds = _b[0], setBuilds = _b[1];
    (0, react_1.useEffect)(function () { api.get('/repos').then(setRepos); api.get('/builds').then(setBuilds); }, []);
    return {
        repos: repos,
        builds: builds,
        runBuild: function (repoId) { return api.post('/builds', { repoId: repoId }); },
        deploy: function (repoId) { return api.post('/deploy', { repoId: repoId }); }
    };
}
