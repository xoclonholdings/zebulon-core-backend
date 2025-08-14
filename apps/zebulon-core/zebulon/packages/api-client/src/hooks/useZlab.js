"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZlab = useZlab;
var react_1 = require("react");
var index_1 = require("../index");
function useZlab(getToken) {
    var api = new index_1.Api(process.env.NEXT_PUBLIC_ZLAB_API, getToken);
    var _a = (0, react_1.useState)([]), projects = _a[0], setProjects = _a[1];
    var _b = (0, react_1.useState)([]), tasks = _b[0], setTasks = _b[1];
    (0, react_1.useEffect)(function () { api.get('/projects').then(setProjects); api.get('/tasks').then(setTasks); }, []);
    return {
        projects: projects,
        tasks: tasks,
        createProject: function (name) { return api.post('/projects', { name: name }); },
        createTask: function (p) { return api.post('/tasks', p); },
        updateTask: function (id, patch) { return api.post("/tasks/".concat(id), patch); }
    };
}
