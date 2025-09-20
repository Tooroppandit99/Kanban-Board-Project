
const STORAGE_KEY = 'kanban:v1';

export const getTasks = () => {
    try {
        const tasks = localStorage.getItem(STORAGE_KEY);
        return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
        console.error("Error retrieving tasks from localStorage:", error);
        return [];
    }
};

export const saveTasks = (tasks) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
    }
};

export const clearAllTasks = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing tasks from localStorage:", error);
    }
};


