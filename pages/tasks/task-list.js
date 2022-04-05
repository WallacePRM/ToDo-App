const initTask = async () => {

    document.querySelector('.toDo-actions form').addEventListener('submit', handleCreateTask);
    tasksList = await getTasks();

    addButtonRipple(document.querySelector('.app'));
    loadTasks();
};

const loadTasks = () => {

    loadPage.show();

    document.querySelector('.toDo-tasks-list').innerHTML = '';
    removePopup();
    if (document.querySelector('.toDo-done-list')) document.querySelector('.toDo-done-list .tasks-list').innerHTML = '';
    const emptyMessage = document.querySelector('.empty-message');
    if (emptyMessage) emptyMessage.remove();

    const $toDoListTitle = document.querySelector('.toDo-list-title');
    if (tasksList.length === 0) {

        setTimeout(() => loadPage.remove(), 1000);

        const $message = document.createElement('div');
        $message.classList.add('empty-message');
        $message.classList.add('noselect');
        $message.innerHTML = `
            <div class="empty-message noselect">
                <!-- <i class="fas fa-check" aria-hidden="true"></i> -->
                <img src="../src/assets/img/platelet.svg">
                <h3>Nenhuma tarefa cadastrada</h3>
                <span>Suas tarefas irão aparecer aqui.</span>
            </div>`
        ;

        $toDoListTitle.insertAdjacentElement('afterend' , $message);
        return;
    }

    // Ordernar por importância

    const config = getUserConfig();
    let orderedTasks;
    if (config.general.task_important_top) {
        orderedTasks = orderTasks();
    }
    else {
        orderedTasks = tasksList;
    }

    let taskIsDone = false;
    orderedTasks.forEach(task => {

        const $task = createTask(task);
        if (task.isDone) {
            appendDoneTask($task);
            taskIsDone = true;
        }
        else {
            appendTask($task);
        }
    });

    if (!taskIsDone) {
        document.querySelector('.task-view .content').style.paddingBottom = document.querySelector('.toDo-actions').offsetHeight + 'px';
    }
    else {
        document.querySelector('.task-view .content').style.paddingBottom = '0px';
    }

    syncUserConfig();
    loadPage.remove();
};

const createTask = (task) => {

    const $task = document.createElement('div');
    $task.classList.add('task-item');
    $task.setAttribute('data-id', task.id);
    $task.setAttribute('create-at', task.create_at ? task.create_at : new Date());
    if (task.important) $task.setAttribute('data-important', true);
    if (task.done_at) $task.setAttribute('done-at', task.done_at);

    $task.innerHTML = `
        <input class="checkbox-input" type="checkbox" ${task.isDone ? 'checked' : ''}>
        <div class="checkbox-box"></div>
        <div class="task-description">
            <div class="task-name">
                <span style="${task.isDone ? 'text-decoration: line-through;' : ''}">${task.name}</span>
                <i name="btn_important" class="${task.important ? 'fas fa-star' : 'far fa-star'}"></i>
            </div>
            <pre class="task-note">${task.note ? task.note : ''}</pre>
        </div>
    `;

    $task.addEventListener('click', handleUpdateTask);
    $task.addEventListener('contextmenu', handleShowTaskOptions, false);
    $task.querySelector('.checkbox-box').addEventListener('click', handleUpdateTaskStatus);
    $task.querySelector('[name="btn_important"]').addEventListener('click', handleUpdateTaskImportance);

    return $task;
};

const appendTask = ($task) => {
    const $tasksList = document.querySelector('.toDo-tasks-list');
    $tasksList.insertAdjacentElement('beforeend', $task);
};

const deleteTask = (taskId) => {

    removeTask(taskId);

    if (document.querySelectorAll('.modal-task').length > 0) {
        const $taskId = parseInt(document.querySelector('.modal-task').getAttribute('data-id'));
        if ($taskId === taskId) {
            removeModalTask();
        }
    }

    loadTasks();
    if (document.querySelectorAll('.toDo-done-list .task-item').length === 0) {

        const $doneList = document.querySelector('.toDo-done-list');
        if ($doneList) $doneList.remove();
    }
};

// HANDLES
const handleCreateTask = (e) => {

    // if (e.code === "Enter") {
        e.preventDefault();
        loadPage.show();

        const input = document.querySelector('[name="btn_add_task"]');
        const task = {
            id: new Date().valueOf(),
            name: input.value,
            note: '',
            isDone: false,
            create_at: new Date(),
            done_at: null,
            important: false,
        };

        postTask(task);
        input.value = '';

        loadTasks();
        loadPage.remove();
    // }
};

const handleUpdateTask = (e) => {

    const $taskItem = document.querySelectorAll('.task-item');
    $taskItem.forEach(taskItem => taskItem.classList.remove('active'));

    const $task = e.currentTarget;
    $task.classList.add('active');

    const task = getTaskData($task);
    if (document.querySelectorAll('.modal-task').length > 0) {
        const taskId = parseInt(document.querySelector('.modal-task').getAttribute('data-id'));
        if (task.id === taskId) {
            removeModalTask();
            return;
        }
    }

    createModalTask(task);
    setTimeout(() => showModalTask(), 50);

};

const handleUpdateTaskStatus = (e) => {

    e.stopPropagation();
    const $modal = document.querySelector('.modal-task');
    const $taskItem = e.currentTarget.parentNode;
    const task = getTaskData($taskItem);

    if (task.isDone) {
        task.isDone = false;
        task.done_at = null;
        if ($modal) {
            const date = task.isDone ? new Date(task.done_at) : new Date(task.create_at);
            const days = difInDays(date, new Date());
            const timeText = mapDifInDays(days);

            $modal.querySelector('.checkbox-input').checked = false;
            $modal.querySelector('footer span').innerHTML = `Criada ${days >= 2 ? 'há ' + days + ' dias atrás' : timeText}`;
        }

        putTask(task);
    }
    else {
        task.isDone = true;
        task.done_at = new Date().toDateString();
        if ($modal) {
            const date = task.isDone ? new Date(task.done_at) : new Date(task.create_at);
            const days = difInDays(date, new Date());
            const timeText = mapDifInDays(days);

            $modal.querySelector('.checkbox-input').checked = true;
            $modal.querySelector('footer span').innerHTML = `Concluída ${days >= 2 ? 'há ' + days + ' dias atrás' : timeText}`;
        }

        const userConfig = getUserConfig();
        putTask(task)
        if (userConfig.general.sound_notify) playNotify();
    }

    loadTasks();
    if (document.querySelectorAll('.toDo-done-list .task-item').length === 0) {

        const $doneList = document.querySelector('.toDo-done-list');
        if ($doneList) $doneList.remove();
    }

};

const handleUpdateTaskImportance = (e) => {

    e.stopPropagation();

    const $modal = document.querySelector('.modal-task');
    const $taskItem = findAncestor(e.currentTarget, '.task-item');
    const task = getTaskData($taskItem);

    if (task.important) {
        task.important = false;

        putTask(task);

        if ($modal) {

            const taskId = parseInt($modal.getAttribute('data-id'));
            if (task.id === taskId) {
                const color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
                const $icon = $modal.querySelector('[name="btn_modal_important"]');

                $icon.classList.remove('fas');
                $icon.classList.add('far');
                $icon.style.color = color;
            }
        }
    }
    else {
        task.important = true;
        putTask(task);

        if ($modal) {

            const taskId = parseInt($modal.getAttribute('data-id'));
            if (task.id === taskId) {
                const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
                const $icon = $modal.querySelector('[name="btn_modal_important"]');

                $icon.classList.remove('far');
                $icon.classList.add('fas');
                $icon.style.color = `rgb(${color})`;
            }
        }
    }

    loadTasks();
};

const handleShowTaskOptions = (e) => {

    e.preventDefault();

    const task = getTaskData(e.currentTarget);
    createTaskOptions(task);
    showPopup(e);
};
