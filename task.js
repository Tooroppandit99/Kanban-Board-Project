export const createTaskElement = (task) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.setAttribute('draggable', 'true');
    taskElement.dataset.id = task.id;

    taskElement.innerHTML = `
        <div class="task-content">
            <h3 class="task-title">${task.title}</h3>
            <p class="task-description">${task.description}</p>
        </div>
        <div class="task-actions">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        </div>
    `;

    return taskElement;
};






