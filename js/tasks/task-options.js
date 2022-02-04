const createTaskOptions = (task) => {

    const options = document.createElement('div');
    options.setAttribute('id', 'taskOptions');
    options.setAttribute('data-task-id', task.id);
    options.innerHTML = `
        <div name="btn_mark_important" class="popup-item">
            <i class="${task.important ? 'fas fa-star' : 'far fa-star'}" style="color: ${task.important ? 'rgba(var(--accent-color))' : 'var(--text-smooth)'}"></i>
            <span>${task.important ? 'Remover importância': 'Marcar como importante'}</span>
        </div>
        <div name="btn_change_status" class="popup-item">
            <i class="${task.isDone ? 'far fa-circle': 'far fa-check-circle'}"></i>
            <span>${task.isDone ? 'Marcar como não concluído' : 'Marcar como concluída'}</span>
        </div>
        <div name="btn_delete" class="popup-item">
            <i class="ti-trash"></i>
            <span>Excluír tarefa</span>
        </div>
    `;

    options.querySelector('[name="btn_delete"]').addEventListener('click', handleDeleteTask);
    options.querySelector('[name="btn_change_status"]').addEventListener('click', handleChangeTaskStatus);
    options.querySelector('[name="btn_mark_important"]').addEventListener('click', handleMarkTaskImportant);

    createPopup(options);
};

const getTaskId = () => {

    return parseInt(document.querySelector('#taskOptions').getAttribute('data-task-id'));
};

// HANDLES
const handleDeleteTask = (e) => {

    e.stopPropagation();

    const taskId = getTaskId();
    const $task = document.querySelector(`.toDo-list [data-id="${taskId}"]`);
    const task = getTaskData($task);

    const config = getUserConfig();
    if (!task.isDone) {
        if (config.general.confirm_exclusion) {
            createAlert(task);
            showAlert(() => {
                deleteTask(taskId);
            });
            removePopup();
            loadTasks();
            return;
        }
        else {
            deleteTask(taskId);
            loadTasks();
        }
    }
    else {
        deleteTask(taskId);
        loadTasks();
    }

    removePopup();
};

const handleMarkTaskImportant = () => {

    const task = document.querySelector(`.task-item[data-id="${getTaskId()}"]`);
    task.querySelector('[name="btn_important"]').click();
};

const handleChangeTaskStatus = () => {

    const taskId = getTaskId();
    const $task = document.querySelector(`.task-item[data-id="${taskId}"]`);

    $task.querySelector('.checkbox-box').click();
};