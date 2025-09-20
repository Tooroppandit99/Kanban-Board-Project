import { getTasks, saveTasks, clearAllTasks } from './storage.js';
import { createTaskElement } from './task.js';

let tasks = getTasks();
const taskForm = document.getElementById('task-form');
const taskLists = document.querySelectorAll('.task-list');

// Function to render tasks
const renderTasks = () => {
    taskLists.forEach(list => list.innerHTML = '');
    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        const column = document.querySelector(`.task-list[data-status="${task.status}"]`);
        if (column) {
            column.appendChild(taskElement);

            // Edit and Delete Event Listeners
            taskElement.querySelector('.edit-btn').addEventListener('click', () => editTask(task));
            taskElement.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task));
        }
    });
};

// Task editing logic
const editTask = (taskToEdit) => {
    const newTitle = prompt("Edit Task Title:", taskToEdit.title);
    if (newTitle !== null) {
        const newDescription = prompt("Edit Task Description:", taskToEdit.description);
        if (newDescription !== null) {
            taskToEdit.title = newTitle;
            taskToEdit.description = newDescription;
            saveTasks(tasks);
            renderTasks();
        }
    }
};

// Task deletion logic
const deleteTask = (taskToDelete) => {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== taskToDelete.id);
        saveTasks(tasks);
        renderTasks();
    }
};

// Task creation logic
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    if (title.trim() === '') return; // Prevent empty tasks

    const newTask = {
        id: Date.now().toString(),
        title,
        description,
        status: 'todo'
    };
    tasks.push(newTask);
    saveTasks(tasks);
    taskForm.reset();
    renderTasks();
});

// Drag and Drop Logic
let draggedTaskElement = null;

document.addEventListener('dragstart', (event) => {
    // Check if the dragged element is a task card
    if (event.target.classList.contains('task')) {
        draggedTaskElement = event.target;
        draggedTaskElement.classList.add('is-dragging');
        event.dataTransfer.setData('text/plain', draggedTaskElement.dataset.id);
    }
});

document.addEventListener('dragend', () => {
    if (draggedTaskElement) {
        draggedTaskElement.classList.remove('is-dragging');
        draggedTaskElement = null;
    }
});

taskLists.forEach(list => {
    list.addEventListener('dragover', (event) => {
        event.preventDefault(); // This is crucial for drop to work
        const afterElement = getDragAfterElement(list, event.clientY);
        const draggable = document.querySelector('.is-dragging');
        if (afterElement == null) {
            list.appendChild(draggable);
        } else {
            list.insertBefore(draggable, afterElement);
        }
        list.classList.add('drag-over');
    });

    list.addEventListener('dragleave', () => {
        list.classList.remove('drag-over');
    });

    list.addEventListener('drop', (event) => {
        event.preventDefault();
        list.classList.remove('drag-over');

        const taskId = event.dataTransfer.getData('text/plain');
        const newStatus = list.dataset.status;
        const taskToUpdate = tasks.find(task => task.id === taskId);
        
        if (taskToUpdate) {
            // Update the status and reorder the tasks array
            taskToUpdate.status = newStatus;
            
            const reorderedTasks = Array.from(list.querySelectorAll('.task')).map(el => {
                return tasks.find(t => t.id === el.dataset.id);
            });
            
            tasks = tasks.filter(t => t.id !== taskId);
            tasks = tasks.concat(reorderedTasks);

            saveTasks(tasks);
            renderTasks();
        }
    });
});

// Utility function for re-ordering within a column
const getDragAfterElement = (container, y) => {
    const draggableElements = [...container.querySelectorAll('.task:not(.is-dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
};

