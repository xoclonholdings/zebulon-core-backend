"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZlab = useZlab;
const react_1 = require("react");
const index_1 = require("../index");
function useZlab(getToken) {
    const api = new index_1.Api(process.env.NEXT_PUBLIC_ZLAB_API, getToken);
    const [projects, setProjects] = (0, react_1.useState)([]);
    const [tasks, setTasks] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => { api.get('/projects').then(setProjects); api.get('/tasks').then(setTasks); }, []);
    return {
        projects, tasks,
        createProject: (name) => api.post('/projects', { name }),
        createTask: (p) => api.post('/tasks', p),
        updateTask: (id, patch) => api.post(`/tasks/${id}`, patch)
    };
}
