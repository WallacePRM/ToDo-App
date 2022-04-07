const createModalTask = (task) => {

    const $modal = document.querySelector('.modal-task-background');
    if ($modal) $modal.remove();

    const modalBackground = document.createElement('div');

    const date = task.isDone ? new Date(task.done_at) : new Date(task.create_at);
    const days = difInDays(date, new Date());
    const timeText = mapDifInDays(days);

    const config = getUserConfig();
    modalBackground.classList.add('modal-task-background');

    const lightOn = document.querySelectorAll('[theme="light"]').length > 0;

    const modalOpacity = parseFloat(config.user_theme.modal_opacity);
    modalBackground.innerHTML = `
        <div class="modal-task" data-id="${task.id}" style="background: linear-gradient(to top, rgba(var(--secundary-color), ${modalOpacity}), rgba(var(--secundary-color), ${modalOpacity + 0.1}))">
            <header>
                <i name="btn_close_modal_task" class="btn-icon btn-ripple ti-close" onclick="handleRemoveModalTask()"></i>
            </header>
            <div class="modal-task-content">
                <div class="modal-task-title view-template">
                    <div>
                        <input ${task.isDone ? 'checked' : ''} class="checkbox-input" type="checkbox">
                        <div class="checkbox-box"></div>
                        <form name="btn_change_name">
                            <input value="${task.name}"/>
                        </form>
                    </div>
                    <i name="btn_modal_important" class="${task.important ? 'fas fa-star' : 'far fa-star'}" style="color: ${task.important ? 'rgba(var(--accent-color))' : ''}"></i>
                </div>
                <div class="modal-task-note view-template">
                    <textarea name="btn_add_note" placeholder="Adicionar anotação" spellcheck="false" rows="3">${task.note ? task.note : ''}</textarea>
                </div>
            </div>
            <footer style="color: ${lightOn && config.user_theme.modal_opacity < 0.4 ? '#fff' : null}">
                <!-- Criada 34 minutos atrás -->
                <span>
                ${task.isDone ? 'Concluída' : 'Criada'} ${days >= 2 ? 'há ' + days + ' dias atrás' : timeText}
                </span>
                <i name="btn_delete_task" class="btn-icon btn-ripple ti-trash"></i>
            </footer>
        </div>
    `;

    modalBackground.querySelector('.checkbox-box').addEventListener('click', handleUpdateTaskStatusModal);
    modalBackground.querySelector('[name="btn_change_name"]').addEventListener('submit', handleChangeTaskName);
    modalBackground.querySelector('[name="btn_modal_important"]').addEventListener('click', handleUpdateTaskImportanceModal);
    modalBackground.querySelector('[name="btn_delete_task"]').addEventListener('click', handleRemoveTaskModal);

    let typingTimer;
    modalBackground.querySelector('[name="btn_add_note"]').addEventListener('keyup', (e) => {
        clearTimeout(typingTimer);

        const $el = e.currentTarget;
        typingTimer = setTimeout(() => updateTaskNote($el), 2000);
    });
    modalBackground.querySelector('[name="btn_add_note"]').addEventListener('keydown', () => clearTimeout(typingTimer));

    const $mainFrame = document.querySelector('.main-frame');
    $mainFrame.insertAdjacentElement('beforeend', modalBackground);

    addButtonRipple(modalBackground);
};

const showModalTask = () => {

    const $mainFrame = document.querySelector('.main-frame');
    $mainFrame.setAttribute('show-modal-task', true);
};

const removeModalTask = () => {

    const $mainFrame = document.querySelector('.main-frame');
    $mainFrame.setAttribute('show-modal-task', false);

    const $modalTask = document.querySelector('.modal-task-background');
    setTimeout(() => $modalTask.remove(), 400);

    const $taskItem = document.querySelectorAll('.task-item');
    $taskItem.forEach(taskItem => taskItem.classList.remove('active'));
};

const updateTaskNote = ($el) => {

    const $modal = findAncestor($el, '.modal-task');
    const taskId = parseInt($modal.getAttribute('data-id'));
    const $task = document.querySelector(`.toDo-list [data-id="${taskId}"]`);

    const note = $el.value;
    const task = getTaskData($task);
    task.note = note;

    putTask(task);
    loadTasks();
};

/* HANDLES */

const handleRemoveModalTask = () => {

    removeModalTask();
};

const handleUpdateTaskStatusModal = (e) => {

    const $el = e.currentTarget;
    const $modal = findAncestor($el, '.modal-task');
    const taskId = $modal.getAttribute('data-id');
    const $task = document.querySelector(`.task-item[data-id="${taskId}"]`);

    $task.querySelector('.checkbox-box').click();
};

const handleUpdateTaskImportanceModal = (e) => {

    const $el = e.currentTarget;
    const $modal = findAncestor($el, '.modal-task');
    const taskId = parseInt($modal.getAttribute('data-id'));
    const $task = document.querySelector(`.toDo-list [data-id="${taskId}"]`);

    $task.querySelector('[name="btn_important"]').click();
};

const handleRemoveTaskModal = (e) => {

    const $el = e.currentTarget;
    const $modal = findAncestor($el, '.modal-task');
    const taskId = parseInt($modal.getAttribute('data-id'));
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

    removeModalTask();

    if (document.querySelectorAll('.toDo-done-list .task-item').length === 0) {

        const $doneList = document.querySelector('.toDo-done-list');
        if ($doneList) $doneList.remove();
    }
};

const handleChangeTaskName = (e) => {

    e.preventDefault();

    const $el = e.currentTarget.querySelector('input');
    const $modal = findAncestor($el, '.modal-task');
    const taskId = parseInt($modal.getAttribute('data-id'));
    const $task = document.querySelector(`.toDo-list [data-id="${taskId}"]`);

    const name = $el.value;
    const task = getTaskData($task);
    task.name = name;

    $el.blur();
    putTask(task);
    loadTasks();
};