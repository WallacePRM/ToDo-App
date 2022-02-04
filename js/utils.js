const addButtonRipple = ($el) => {

    const buttons = $el.querySelectorAll('.btn-ripple');
    buttons.forEach( btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;

            let ripples = document.createElement('span');
            ripples.classList.add('ripple');
            ripples.style.left = '50%';
            ripples.style.top = '50%';
            btn.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 1000);
        });
    });
};

// retorna 0, 1 ou número de dias
const difInDays = (d1, d2) => {

    // // Calcular número de tempo entre as duas datas
    const Difference_In_Time = d2.getTime() - d1.getTime();

    // Calcular número de dias entre as duas datas
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    // Retorna a diferença de dias
    if (Difference_In_Days >= 1) {
        if (Difference_In_Days >= 2) {
            return Difference_In_Days.toFixed(0);
        }
        else {
            return 1;
        }
    }
    else {
        return 0;
    }
};

// retorna 'hoje', 'ontem' ou 'x' dias atrás
const mapDifInDays = (dif) => {

    const time = ['hoje', 'ontem'];
    return time[dif] || dif;
};

const findAncestor = (el, sel) => {
    while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
    return el;
};

const orderTasks = () => {

    const tasksOrdered = [];
    tasksList.forEach(task => {
        if (task.important) {
            tasksOrdered.unshift(task);
        }
        else {
            tasksOrdered.push(task);
        }
    });

    return tasksOrdered;
};

const checkLeftOvertaking = (el, screen) => {

    const parent = screen.offsetWidth;
    const target = parseInt(el.style.left) + el.offsetWidth;
    if (target > parent) return true;
    return false;
};

const playNotify = () => {
    const audio = new Audio('./sounds/notify-1.mp3');
    audio.play();
};

const getTaskData = ($task) => {

    const task = {};
    task.id = parseInt($task.getAttribute('data-id'));
    task.name = $task.querySelector('.task-name span').textContent;
    task.note = $task.querySelector('.task-note').textContent;
    task.create_at = $task.getAttribute('create-at');
    task.done_at = $task.getAttribute('done-at');
    task.isDone = $task.querySelector('.checkbox-input').checked;
    task.important = $task.getAttribute('data-important');

    return task;
};
