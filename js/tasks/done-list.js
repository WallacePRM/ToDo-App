const appendDoneList = () => {

    if (document.querySelector('.toDo-done-list') === null) {

        const doneList = document.createElement('div');
        doneList.classList.add('toDo-done-list');
        doneList.innerHTML = `
            <div class="toDo-list-title">
                <div class="btn-ripple">
                    <i class="ti-angle-down"></i>
                    <h3>Concluída</h3>
                    <span class="done-count">0</span>
                </div>
            </div>
            <div class="tasks-list"></div>
        `;

        doneList.querySelector('.toDo-list-title').addEventListener('click', handleToggleDoneList);
        document.querySelector('.toDo-tasks-list').insertAdjacentElement('afterend', doneList);

        addButtonRipple(document.querySelector('.toDo-done-list'));
    }
};

const appendDoneTask = ($task) => {

    appendDoneList();

    const $doneList = document.querySelector('.toDo-done-list .tasks-list');
    $doneList.insertAdjacentElement('beforeend', $task);

    const doneCount = document.querySelectorAll('.toDo-done-list .checkbox-input:checked').length;
    document.querySelector('.done-count').innerHTML = doneCount;
};

// HANDLE
const handleToggleDoneList = (e) => {

    const $doneList = e.currentTarget.parentNode;
    if ($doneList.classList.contains('hidden')) {
        $doneList.classList.remove('hidden');
    }
    else {
        $doneList.classList.add('hidden');
    }
};
