"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZedCore = void 0;
var react_1 = require("react");
var queryClient_1 = require("@/lib/queryClient");
var useZedCore = function (userId) {
    var _a = (0, react_1.useState)(null), status = _a[0], setStatus = _a[1];
    var _b = (0, react_1.useState)([]), backgroundTasks = _b[0], setBackgroundTasks = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var refresh = function () { return __awaiter(void 0, void 0, void 0, function () {
        var statusResponse, statusData, tasksResponse, tasksData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, 9, 10]);
                    return [4 /*yield*/, fetch("/api/zed-core/status/".concat(userId))];
                case 2:
                    statusResponse = _a.sent();
                    if (!statusResponse.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, statusResponse.json()];
                case 3:
                    statusData = _a.sent();
                    setStatus(statusData.status);
                    _a.label = 4;
                case 4: return [4 /*yield*/, fetch("/api/zed-core/background-tasks/".concat(userId))];
                case 5:
                    tasksResponse = _a.sent();
                    if (!tasksResponse.ok) return [3 /*break*/, 7];
                    return [4 /*yield*/, tasksResponse.json()];
                case 6:
                    tasksData = _a.sent();
                    setBackgroundTasks(tasksData.tasks || []);
                    _a.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_1 = _a.sent();
                    console.error('Error refreshing Zed Core data:', error_1);
                    return [3 /*break*/, 10];
                case 9:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    var createReminder = function (reminder) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, queryClient_1.apiRequest)('/api/zed-core/reminder', 'POST', __assign({ userId: userId }, reminder))];
                case 1:
                    response = _a.sent();
                    if (!response.success) {
                        throw new Error('Failed to create reminder');
                    }
                    // Refresh data after creating reminder
                    return [4 /*yield*/, refresh()];
                case 2:
                    // Refresh data after creating reminder
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error creating reminder:', error_2);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var createBackgroundTask = function (type, description, data) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, queryClient_1.apiRequest)('/api/zed-core/background-task', 'POST', {
                            userId: userId,
                            taskType: type,
                            description: description,
                            data: data
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.success) {
                        throw new Error('Failed to create background task');
                    }
                    // Refresh data after creating task
                    return [4 /*yield*/, refresh()];
                case 2:
                    // Refresh data after creating task
                    _a.sent();
                    return [2 /*return*/, response.taskId];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error creating background task:', error_3);
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var announceTaskCompletion = function (taskId, description, results) { return __awaiter(void 0, void 0, void 0, function () {
        var response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, queryClient_1.apiRequest)('/api/zed-core/announce-completion', 'POST', {
                            userId: userId,
                            taskId: taskId,
                            taskDescription: description,
                            results: results
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.success) {
                        throw new Error('Failed to announce task completion');
                    }
                    // Refresh data after announcing completion
                    return [4 /*yield*/, refresh()];
                case 2:
                    // Refresh data after announcing completion
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error announcing task completion:', error_4);
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Initialize and refresh data on mount
    (0, react_1.useEffect)(function () {
        refresh();
    }, [userId]);
    // Auto-refresh every 30 seconds
    (0, react_1.useEffect)(function () {
        var interval = setInterval(refresh, 30000);
        return function () { return clearInterval(interval); };
    }, [userId]);
    return {
        status: status,
        isLoading: isLoading,
        backgroundTasks: backgroundTasks,
        createReminder: createReminder,
        createBackgroundTask: createBackgroundTask,
        announceTaskCompletion: announceTaskCompletion,
        refresh: refresh
    };
};
exports.useZedCore = useZedCore;
