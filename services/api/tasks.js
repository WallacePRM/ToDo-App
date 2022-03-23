
let tasksList = [];

const delay = (timeout) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res();
        }, timeout);
    });
};

const getTasks = async () => {

    const result = JSON.parse(localStorage.getItem('tasks')) || [];
    return result;
};

const postTask = (task) => {

    const config = getUserConfig();
    if (config.general.new_task_top) {
        tasksList.unshift(task);
    }
    else {
        tasksList.push(task);
    }

    localStorage.setItem('tasks', JSON.stringify(tasksList));
};

const putTask = (task) => {

    for (let i = 0; i < tasksList.length; i++) {
        if (tasksList[i].id === task.id) {

            tasksList.splice([i], 1, task);
            localStorage.setItem('tasks', JSON.stringify(tasksList));
            return;
        }
    };
};

const removeTask = (taskId) => {

    for (let i = 0; i < tasksList.length; i++) {
        if (tasksList[i].id === taskId) {

            tasksList.splice([i], 1);
            localStorage.setItem('tasks', JSON.stringify(tasksList));
            return;
        }
    };
};