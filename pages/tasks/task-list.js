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

        const $emptyMessage = appendEmptyTask();
        $toDoListTitle.insertAdjacentElement('afterend' , $emptyMessage);
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

const appendEmptyTask = () => {

    const $message = document.createElement('div');
    $message.classList.add('empty-message');
    $message.classList.add('noselect');
    $message.innerHTML = `
        <div class="empty-message noselect">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="195" height="147" viewBox="0 0 195 147">
                <defs>
                    <linearGradient id="linear-gradient" x1="-0.904" y1="-1.002" x2="1.083" y2="1.051" gradientUnits="objectBoundingBox">
                    <stop offset="0" stop-color="#ee9ae5"></stop>
                    <stop offset="1" stop-color="#5961f9"></stop>
                    </linearGradient>
                    <filter id="Mask" x="-103.963" y="-135.686" width="406.622" height="435.961" filterUnits="userSpaceOnUse">
                    <feOffset input="SourceAlpha"></feOffset>
                    <feGaussianBlur stdDeviation="52" result="blur"></feGaussianBlur>
                    <feFlood flood-color="#8070f4" flood-opacity="0.6"></feFlood>
                    <feComposite operator="in" in2="blur"></feComposite>
                    <feComposite in="SourceGraphic"></feComposite>
                    </filter>
                    <clipPath id="clip-path">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Mask)">
                        <path id="Mask-2" data-name="Mask" d="M79.623,123.962H15a15,15,0,0,1-15-15V15A15,15,0,0,1,15,0h7.046a14.25,14.25,0,0,0,4.518,9.372A14.254,14.254,0,0,0,36.309,13.2H58.754A14.255,14.255,0,0,0,68.5,9.372,14.251,14.251,0,0,0,73.016,0h6.607a15,15,0,0,1,15,15v93.961a15,15,0,0,1-15,15Z" transform="translate(0 0)" fill="url(#linear-gradient)"></path>
                    </g>
                    </clipPath>
                    <linearGradient id="linear-gradient-3" x1="-0.263" y1="-0.258" x2="0.958" y2="0.948" gradientUnits="objectBoundingBox">
                    <stop offset="0" stop-color="#9dd8fb"></stop>
                    <stop offset="1" stop-color="#58b3fb"></stop>
                    </linearGradient>
                    <filter id="Combined_Shape_Copy_2" x="-77.998" y="-155" width="354.691" height="339.287" filterUnits="userSpaceOnUse">
                    <feOffset input="SourceAlpha"></feOffset>
                    <feGaussianBlur stdDeviation="52" result="blur-2"></feGaussianBlur>
                    <feFlood flood-color="#8070f4" flood-opacity="0.6"></feFlood>
                    <feComposite operator="in" in2="blur-2"></feComposite>
                    <feComposite in="SourceGraphic"></feComposite>
                    </filter>
                    <clipPath id="clip-Prancheta_1">
                    <rect width="195" height="147"></rect>
                    </clipPath>
                </defs>
                <g id="Prancheta_1" data-name="Prancheta – 1" clip-path="url(#clip-Prancheta_1)">
                    <g id="Grupo_5422" data-name="Grupo 5422" transform="translate(-2674 17881.725)">
                    <path id="Caminho_689" data-name="Caminho 689" d="M64.81,152.25c-2.593.783-5.02,2.68-5.668,5.312-.741,3.024.968,6.073,1.215,9.178.8,10.174-13.676,17.353-11.612,27.347.82,3.974,4.134,6.9,7.4,9.312,5.231,3.856,11.035,7.263,17.462,8.225,9.755,1.462,19.948-2.834,29.43-.119,7.648,2.19,13.5,8.61,21.1,10.978,5.782,1.8,12.01,1.093,18.017.362,3.239-.393,6.632-.846,9.245-2.79,4.858-3.618,5.164-10.761,8.417-15.881,5.024-7.895,16.041-9.446,25.278-7.911s18.207,5.312,27.566,5a12.582,12.582,0,0,0,5.794-1.32c2.122-1.192,3.555-3.294,4.822-5.373a86.936,86.936,0,0,0,12.606-43.2c.055-2.622-.038-5.356-1.271-7.67-1.559-2.927-4.674-4.678-7.776-5.856-7.448-2.834-15.674-3.3-22.972-6.494-7.039-3.083-12.739-8.49-18.869-13.124a100.506,100.506,0,0,0-41.4-18.436c-3.52-.68-7.174-1.166-10.672-.381-4.03.9-7.5,3.417-10.628,6.122-8.31,7.195-14.97,16.071-22.628,23.956a128.842,128.842,0,0,1-17.191,14.824c-2.834,2.043-5.846,4.468-9,5.978C70.577,151.678,67.867,151.329,64.81,152.25Z" transform="translate(2631.113 -17959.881)" fill="#6c63ff" opacity="0.2"></path>
                    <g id="_3.1" data-name="3.1" transform="translate(2726.037 -17880.725)">
                        <g id="Path_7_Copy_2" data-name="Path 7 Copy 2" transform="translate(0 19.315)">
                        <path id="Mask-3" data-name="Mask" d="M79.623,123.962H15a15,15,0,0,1-15-15V15A15,15,0,0,1,15,0h7.046a14.25,14.25,0,0,0,4.518,9.372A14.254,14.254,0,0,0,36.309,13.2H58.754A14.255,14.255,0,0,0,68.5,9.372,14.251,14.251,0,0,0,73.016,0h6.607a15,15,0,0,1,15,15v93.961a15,15,0,0,1-15,15Z" transform="translate(0 0)" fill="url(#linear-gradient)"></path>
                        <g id="Path_7_Copy_2-2" data-name="Path 7 Copy 2" transform="translate(0 0)" clip-path="url(#clip-path)">
                            <path id="Path_7" data-name="Path 7" d="M9.918,0S42.53,17.522,52.674,48.1s33.353,47.1,84.734,43.271S82.459,118.9,82.459,118.9L0,111.282Z" transform="translate(-13.049 15.941)" fill="#fff" opacity="0.07"></path>
                            <path id="Path_2" data-name="Path 2" d="M6.568,83.155S26.3,74.758,57.3,38.691s49.908-52.752,76.878-24.3-35.414,96.969-35.414,96.969H0Z" transform="translate(-7.271 21.665)" fill="#fff" opacity="0.06"></path>
                            <path id="Path_8" data-name="Path 8" d="M6.724,0s14.183,38.725,41.9,47.038,40.9-38.7,69.6-11.554S98.2,99.771,98.2,99.771H0Z" transform="translate(-6.627 34.119)" fill="#fff" opacity="0.03"></path>
                            <path id="Path_9" data-name="Path 9" d="M0,26.629S14.261,4.07,27.662,15.35s22.384,15.7,33.935,6.365S84.767-8.251,97.2,3.549" transform="translate(0.88 91.544)" fill="none" stroke="#fff" stroke-miterlimit="10" stroke-width="2" stroke-dasharray="10" opacity="0.3"></path>
                        </g>
                        </g>
                        <rect id="Rectangle_8_Copy_10" data-name="Rectangle 8 Copy 10" width="58.974" height="7.042" rx="3.521" transform="translate(18.046 50.81)" fill="#fff" opacity="0.8"></rect>
                        <rect id="Rectangle_8_Copy_11" data-name="Rectangle 8 Copy 11" width="35.208" height="7.042" rx="3.521" transform="translate(17.932 67.672)" fill="#fff" opacity="0.8"></rect>
                        <rect id="Rectangle_12_Copy_2" data-name="Rectangle 12 Copy 2" width="43.57" height="24.206" rx="10" transform="translate(63.184 91.343)" fill="url(#linear-gradient-3)"></rect>
                        <g transform="matrix(1, 0, 0, 1, -52.04, -1)" filter="url(#Combined_Shape_Copy_2)">
                        <path id="Combined_Shape_Copy_2-2" data-name="Combined Shape Copy 2" d="M14.194,27.287A14.194,14.194,0,0,1,0,13.093,4.732,4.732,0,0,1,4.731,8.362h8.083A7.487,7.487,0,0,1,20.245,0h2.641a7.487,7.487,0,0,1,7.43,8.362h7.644a4.732,4.732,0,0,1,4.731,4.731A14.194,14.194,0,0,1,28.5,27.287Z" transform="translate(78 1)" opacity="0.6" fill="url(#linear-gradient)"></path>
                        </g>
                        <rect id="Rectangle_14_Copy_4" data-name="Rectangle 14 Copy 4" width="30.367" height="3.961" rx="1.981" transform="translate(69.752 97.905)" fill="#fff" opacity="0.8"></rect>
                        <rect id="Rectangle_14_Copy_5" data-name="Rectangle 14 Copy 5" width="17.604" height="3.961" rx="1.981" transform="translate(69.668 105.447)" fill="#fff" opacity="0.6"></rect>
                    </g>
                    <g id="Grupo_2623" data-name="Grupo 2623" transform="translate(2675 -17832.248)">
                        <path id="Caminho_701" data-name="Caminho 701" d="M0,441.276s16.306-2.6,17.792,12.017,31.355,16.64,31.355,16.64l-.561.372C23.924,486.5.348,480.617,3.9,459.121,5.225,451.127,5.116,443.1,0,441.276Z" transform="translate(0 -383.479)" fill="#8ed16f"></path>
                        <ellipse id="Elipse_433" data-name="Elipse 433" cx="4.484" cy="11.699" rx="4.484" ry="11.699" transform="translate(16.841 34.22)" fill="#8ed16f"></ellipse>
                        <ellipse id="Elipse_435" data-name="Elipse 435" cx="3.022" cy="6.727" rx="3.022" ry="6.727" transform="translate(9.264 81.03) rotate(-45)" fill="#8ed16f"></ellipse>
                        <g id="Grupo_2625" data-name="Grupo 2625" transform="translate(0 0)">
                        <path id="Caminho_700" data-name="Caminho 700" d="M66.526,156.47a34.123,34.123,0,0,1,6.223,35.495c-8.067,21.205,13.828,56.467,13.828,56.467s-.235-.034-.67-.111c-29.353-5.18-43.928-38.748-27.612-63.684C64.354,175.365,69.344,164.49,66.526,156.47Z" transform="translate(-41.074 -156.47)" fill="#8ed16f"></path>
                        <g id="Grupo_2486" data-name="Grupo 2486" transform="translate(0 57.618)" opacity="0.3">
                            <path id="Caminho_702" data-name="Caminho 702" d="M0,441.276s16.306-2.6,17.792,12.017,31.355,16.64,31.355,16.64l-.561.372C23.924,486.5.348,480.617,3.9,459.121,5.225,451.127,5.116,443.1,0,441.276Z" transform="translate(0 -441.098)" fill="#fff"></path>
                        </g>
                        <ellipse id="Elipse_434" data-name="Elipse 434" cx="4.484" cy="11.699" rx="4.484" ry="11.699" transform="translate(16.841 34.22)" opacity="0.3"></ellipse>
                        <ellipse id="Elipse_436" data-name="Elipse 436" cx="3.022" cy="6.727" rx="3.022" ry="6.727" transform="translate(9.264 81.03) rotate(-45)" opacity="0.3"></ellipse>
                        </g>
                        <g id="Grupo_2487" data-name="Grupo 2487" transform="translate(149.933 11.894)">
                        <path id="Caminho_704" data-name="Caminho 704" d="M854.311,325.8a7.53,7.53,0,0,1,1.722,1.336c.422-.2,7.636-4.706,8.68-4.651s.495,2.124.495,2.325-8.7,6.977-10.12,6.977-3.3-3.076-3.3-3.259A37.055,37.055,0,0,1,854.311,325.8Z" transform="translate(-829.286 -300.774)" fill="#de8e68"></path>
                        <path id="Caminho_705" data-name="Caminho 705" d="M884.774,249.143l-1.072-.152-2.178-.308-.308,2.178L872.069,315.5l-.569,4.016A2.2,2.2,0,0,0,873.368,322l1.073.152a2.2,2.2,0,0,0,2.483-1.869l.568-4.015,9.148-64.644.308-2.178Z" transform="translate(-844.994 -241.91)" fill="#dfdfdf"></path>
                        <path id="Caminho_706" data-name="Caminho 706" d="M924.84,215.227,921.116,222l5.423.768Z" transform="translate(-884.583 -215.227)" fill="#f3f3f3"></path>
                        <path id="Caminho_707" data-name="Caminho 707" d="M935.238,217.712l-.56-2.485-1.227,2.231Z" transform="translate(-894.421 -215.227)" fill="#dfdfdf"></path>
                        <rect id="Retângulo_1914" data-name="Retângulo 1914" width="1.967" height="5.478" transform="translate(26.883 74.893) rotate(-81.94)" fill="#f3f3f3"></rect>
                        <rect id="Retângulo_1915" data-name="Retângulo 1915" width="2.64" height="1.591" transform="translate(18.387 77.568)" fill="#de8e68"></rect>
                        <rect id="Retângulo_1916" data-name="Retângulo 1916" width="2.42" height="1.591" transform="translate(24.656 73.778) rotate(-53.69)" fill="#de8e68"></rect>
                        <path id="Caminho_708" data-name="Caminho 708" d="M777.138,427.652s-1.726,15.486-1.123,17.22,17.642,13.042,17.642,13.042l1.583-2.11-12.891-13.27c.639-.49,3.149-6.633,3.214-7.161s-1.859-8.712-1.859-8.712Z" transform="translate(-768.754 -383.859)" fill="#56cad8"></path>
                        <path id="Caminho_709" data-name="Caminho 709" d="M833.311,320.726c1.374-2.121,6.752,2.276,6.9,3.2s-2.056,4.549-3.784,4.457S832.511,321.962,833.311,320.726Z" transform="translate(-814.417 -298.914)" fill="#fcc486"></path>
                        <path id="Caminho_710" data-name="Caminho 710" d="M786.486,306.642c10.481,0,7.66,21.506,7.5,23.236-.8,1.378-13.528,2.89-14.294,2.052C779.371,329.525,776.582,306.642,786.486,306.642Z" transform="translate(-771.307 -288.136)" fill="#fed385"></path>
                        <path id="Caminho_711" data-name="Caminho 711" d="M810.835,295.583c0,.608,3.365.737,3.365,0V291.45h-3.365Z" transform="translate(-796.627 -276.02)" fill="#de8e68"></path>
                        <ellipse id="Elipse_477" data-name="Elipse 477" cx="3.017" cy="4.055" rx="3.017" ry="4.055" transform="translate(12.207 10.8) rotate(-21.695)" fill="#de8e68"></ellipse>
                        <ellipse id="Elipse_478" data-name="Elipse 478" cx="0.675" cy="0.967" rx="0.675" ry="0.967" transform="translate(12.599 14.71) rotate(-35.61)" fill="#de8e68"></ellipse>
                        <path id="Caminho_712" data-name="Caminho 712" d="M794.4,254.937c0-.562.524-1.179.623-1.885.051-.357-.06-1.845.357-2.348.871-1.042,1.379-.829,2.042-1.071,1.155-.423,1.6-1.123,2.551-1.123,1.089,0,1.524.562,2.3.562.886,0,1.614-.408,2.859-.408a1.848,1.848,0,0,1,1.53,1.633c0,1.81-1.684,1.551-1.684,1.991,0,.306.1.545.1.97,0,.545-.714.871-1.123.871-1.244,0-1.409-.151-1.409-.151a5.833,5.833,0,0,0-.937-1.355,6.277,6.277,0,0,1-2.178.563c-1.081.036-1.844.245-1.844.748,0,.356.131,1.416.123,1.71s-.109.49-.18.49a1.189,1.189,0,0,0-.519-.1c-.446,0-.48.545-.557.545C796.009,256.58,794.4,256.217,794.4,254.937Z" transform="translate(-783.519 -241.772)" fill="#fd8369"></path>
                        <path id="Caminho_713" data-name="Caminho 713" d="M751.388,336.215a1.081,1.081,0,0,0-.4.079.142.142,0,0,0-.109-.058c-.356,0-3.73-.125-4.086-.063.587-.5,1.823-1.8,1.823-1.8l-2.788-3.332c-.628.231-5.176,4.821-5.176,6.5,0,1.552,1.97,1.782,3.4,1.782a26.383,26.383,0,0,0,5.99-.871,1.53,1.53,0,0,0,1.356,1.4,1.878,1.878,0,0,0,0-3.63Z" transform="translate(-740.648 -307.594)" fill="#de8e68"></path>
                        <path id="Caminho_714" data-name="Caminho 714" d="M769.246,316.531c1.742,1.932-3.041,7.269-3.905,7.269s-3.875-3.133-3.547-5.079S768.228,315.4,769.246,316.531Z" transform="translate(-757.494 -295.699)" fill="#fed892"></path>
                        <path id="Caminho_715" data-name="Caminho 715" d="M816.894,421.425l-1.42,36.174h-3.015l-4.647-34.094" transform="translate(-794.216 -379.683)" fill="#74d5de"></path>
                        <path id="Caminho_716" data-name="Caminho 716" d="M817.728,604.282v2.362H810.8v-.776l3.936-1.586Z" transform="translate(-796.601 -525.523)"></path>
                        <path id="Caminho_717" data-name="Caminho 717" d="M868.677,573.624l1.626.981-1.786,6.691-.75-.2-.656-5.333Z" transform="translate(-841.51 -501.072)"></path>
                        </g>
                    </g>
                    </g>
                </g>
            </svg>
            <h3>Nenhuma tarefa cadastrada</h3>
            <span>Suas tarefas irão aparecer aqui.</span>
        </div>`
    ;

    return $message;
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
