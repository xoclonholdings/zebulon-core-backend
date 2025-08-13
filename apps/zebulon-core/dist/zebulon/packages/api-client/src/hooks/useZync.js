"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZync = useZync;
const react_1 = require("react");
const index_1 = require("../index");
function useZync(getToken) {
    const api = new index_1.Api(process.env.NEXT_PUBLIC_ZYNC_API, getToken);
    const [repos, setRepos] = (0, react_1.useState)([]);
    const [builds, setBuilds] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => { api.get('/repos').then(setRepos); api.get('/builds').then(setBuilds); }, []);
    return {
        repos, builds,
        runBuild: (repoId) => api.post('/builds', { repoId }),
        deploy: (repoId) => api.post('/deploy', { repoId })
    };
}
