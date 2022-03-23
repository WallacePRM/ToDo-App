const createAlert = (task) => {

    const backgroundAlert = document.createElement('div');
    backgroundAlert.setAttribute('id', 'alert');
    backgroundAlert.innerHTML = `
        <div class="task-alert view-template" task-id="${task.id}">
            <header>
                <h1>Excluír tarefa</h1>
            </header>
            <div class="alert-content">
                "${task.name}" será excluída. Deseja continuar?
            </div>
            <footer>
                <button class="btn btn-primary">Excluír</button>
                <button class="btn btn-secundary">Cancelar</button>
            </footer>
        </div>
    `;

    const body = document.querySelector('body');
    body.appendChild(backgroundAlert);
};

const showAlert = (onConfirm) => {
    const alert = document.querySelector('#alert');
    alert.querySelector('.btn-primary').addEventListener('click', () => {
        onConfirm();
        removeAlert();
    });
    alert.querySelector('.btn-secundary').addEventListener('click', removeAlert);

    alert.classList.add('active');
    setTimeout(() => alert.querySelector('.task-alert').classList.add('active'), 10);
};

const removeAlert = () => {

    const alert = document.querySelector('#alert');
    alert.remove()
};