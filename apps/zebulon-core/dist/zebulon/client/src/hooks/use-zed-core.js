"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useZedCore = void 0;
const react_1 = require("react");
const queryClient_1 = require("@/lib/queryClient");
const useZedCore = (userId) => {
    const [status, setStatus] = (0, react_1.useState)(null);
    const [backgroundTasks, setBackgroundTasks] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const refresh = async () => {
        setIsLoading(true);
        try {
            // Get Zed Core status
            const statusResponse = await fetch(`/api/zed-core/status/${userId}`);
            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                setStatus(statusData.status);
            }
            // Get background tasks
            const tasksResponse = await fetch(`/api/zed-core/background-tasks/${userId}`);
            if (tasksResponse.ok) {
                const tasksData = await tasksResponse.json();
                setBackgroundTasks(tasksData.tasks || []);
            }
        }
        catch (error) {
            console.error('Error refreshing Zed Core data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    const createReminder = async (reminder) => {
        try {
            const response = await (0, queryClient_1.apiRequest)('/api/zed-core/reminder', 'POST', {
                userId,
                ...reminder
            });
            if (!response.success) {
                throw new Error('Failed to create reminder');
            }
            // Refresh data after creating reminder
            await refresh();
        }
        catch (error) {
            console.error('Error creating reminder:', error);
            throw error;
        }
    };
    const createBackgroundTask = async (type, description, data) => {
        try {
            const response = await (0, queryClient_1.apiRequest)('/api/zed-core/background-task', 'POST', {
                userId,
                taskType: type,
                description,
                data
            });
            if (!response.success) {
                throw new Error('Failed to create background task');
            }
            // Refresh data after creating task
            await refresh();
            return response.taskId;
        }
        catch (error) {
            console.error('Error creating background task:', error);
            throw error;
        }
    };
    const announceTaskCompletion = async (taskId, description, results) => {
        try {
            const response = await (0, queryClient_1.apiRequest)('/api/zed-core/announce-completion', 'POST', {
                userId,
                taskId,
                taskDescription: description,
                results
            });
            if (!response.success) {
                throw new Error('Failed to announce task completion');
            }
            // Refresh data after announcing completion
            await refresh();
        }
        catch (error) {
            console.error('Error announcing task completion:', error);
            throw error;
        }
    };
    // Initialize and refresh data on mount
    (0, react_1.useEffect)(() => {
        refresh();
    }, [userId]);
    // Auto-refresh every 30 seconds
    (0, react_1.useEffect)(() => {
        const interval = setInterval(refresh, 30000);
        return () => clearInterval(interval);
    }, [userId]);
    return {
        status,
        isLoading,
        backgroundTasks,
        createReminder,
        createBackgroundTask,
        announceTaskCompletion,
        refresh
    };
};
exports.useZedCore = useZedCore;
