const createModalApp = () => {

    const mainFrame = document.querySelector('.main-frame');
    const modalApp = document.createElement('div');
    modalApp.classList.add('modal-app-options');
    modalApp.classList.add('noselect');
    modalApp.innerHTML = `
        <header>
            <i name="btn_modal_app" class="ti-arrow-left btn-ripple btn-icon"></i>
            <h1>Configurações</h1>
        </header>
        <div class="app-options">
            <div class="app-options-screen">
                <div class="app-options-group">
                    <div class="app-group-item user-account">
                        <div class="user-account-view">
                            <div class="user-account-img"><span>US</span></div>
                            <div class="user-account-info">
                                <span class="user-name">Usuário</span>
                                <span class="user-email">usuário@gmail.com</span>
                            </div>
                        </div>
                        <div class="user-account-actions">
                            <button class="btn btn-secundary btn-ripple">Gerenciar conta</button>
                            <button name="btn_sign_out" class="btn btn-primary btn-ripple">Sair</button>
                        </div>
                    </div>
                </div>
                <div class="app-options-group modal-general">
                    <h3>Geral</h3>
                    <div name="sound_notify" class="app-group-item">
                        <label>Reproduzir som de conclusão</label>
                        <div class="group-item-action">
                            <input name="btn_sound_notify" class="checkbox-switch" type="checkbox"/>
                        </div>
                    </div>
                    <div name="confirm_exclusion" class="app-group-item">
                        <label>Confirmar antes de excluír as tarefas pendentes</label>
                        <div class="group-item-action">
                            <input name="btn_confirm_exclusion" class="checkbox-switch" type="checkbox"/>
                        </div>
                    </div>
                    <div name="task_important_top" class="app-group-item">
                        <label>Mover tarefas importantes para o topo da lista</label>
                        <div class="group-item-action">
                            <input  name="btn_task_important_top" class="checkbox-switch" type="checkbox"/>
                        </div>
                    </div>
                    <div name="new_task_top" class="app-group-item">
                        <label>Adicionar novas tarefas no topo da lista</label>
                        <div class="group-item-action">
                            <input name="btn_new_task_top" class="checkbox-switch" type="checkbox"/>
                        </div>
                    </div>
                </div>
                <div class="app-options-group modal-themes">
                    <h3>Tema</h3>
                    <div class="app-group-item" data-theme="light">
                        <div class="group-item-action">
                            <input class="checkbox-radio" type="checkbox"/>
                            <span>Tema claro</span>
                        </div>
                    </div>
                    <div class="app-group-item" data-theme="dark">
                        <div class="group-item-action">
                            <input class="checkbox-radio" type="checkbox"/>
                            <span>Tema escuro</span>
                        </div>
                    </div>
                    <div class="app-group-item" data-theme="auto">
                        <div class="group-item-action">
                            <input class="checkbox-radio" type="checkbox"/>
                            <span>Usar o meu tema do windows</span>
                        </div>
                    </div>
                </div>
                <div class="app-options-group modal-help">
                    <h3>Ajuda e comentários</h3>
                    <div class="app-group-item">
                       <label>Está tudo sincronizado. Mãos à obra!</label>
                    </div>
                    <div class="app-group-item">
                      <button name="btn_sync" class="btn btn-primary btn-ripple">Sincronizar</button>
                    </div>
                    <div class="app-group-item">
                       <a target="_blank" class="link" href="https://github.com/WallacePRM">Obter suporte</a>
                    </div>
                </div>
                <div class="app-options-group" style="border: none;">
                    <h3>To Do</h3>
                    <span><i class="far fa-copyright" style="margin-right: 5px;"></i>2022 Wprmdev-team. Todos os direitos reservados</span>
                    <div class="app-group-item" style="margin: 0">
                        <div class="group-item-action">
                            <div class="app-version">2022.1.24<div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    setModalConfig(modalApp);
    modalApp.querySelector('[name="btn_modal_app"]').addEventListener('click', handleRemoveModalApp);

    const generalItem = modalApp.querySelectorAll('.modal-general .checkbox-switch');
    generalItem.forEach(item => item.addEventListener('click', handleChangeGeneral));

    const themeItem = modalApp.querySelectorAll('.modal-themes .group-item-action');
    themeItem.forEach(item => item.addEventListener('click', handleChangeTheme));

    modalApp.querySelector('[name="btn_sync"]').addEventListener('click', handleSyncUserConfig);

    mainFrame.appendChild(modalApp);
};

const removeModalApp = () => {

    const modalApp = document.querySelector('.modal-app-options');
    modalApp.style.opacity = 0;
    setTimeout(() => modalApp.remove(), 200);
};

const showModalApp = () => {

    const modalApp = document.querySelector('.modal-app-options');
    modalApp.classList.add('active');
};

const setModalConfig = (modalApp) => {

    const config = getUserConfig();

    // GERAL
    config.general.sound_notify ? modalApp.querySelector('[name="btn_sound_notify"]').checked = true : false;
    config.general.confirm_exclusion ? modalApp.querySelector('[name="btn_confirm_exclusion"]').checked = true : false;
    config.general.task_important_top ? modalApp.querySelector('[name="btn_task_important_top"]').checked = true : false;
    config.general.new_task_top ? modalApp.querySelector('[name="btn_new_task_top"]').checked = true : false;

    // TEMA
    modalApp.querySelector(`[data-theme="${config.user_theme.theme}"] input`).checked = true;
};

const syncUserConfig = () => {

    const config = getUserConfig();

    if (document.querySelectorAll('.modal-app-options').length === 0) return;
    const groupItem = document.querySelector('.modal-app-options .modal-help');
    groupItem.classList.add('syncing');

    groupItem.querySelector('[name="btn_sync"]').textContent = 'Sincronizando...';

    putUserConfig(config);

    setTimeout(() => {
        groupItem.classList.remove('syncing');
        groupItem.querySelector('[name="btn_sync"]').textContent = 'Sincronizar';
    }, 2000);
};

// HANDLES
const handleRemoveModalApp = () => {
    removeModalApp();
};

const handleChangeGeneral = (e) => {

    const status = e.currentTarget.checked;
    const groupItem = findAncestor(e.currentTarget, '.app-group-item');
    const configName = groupItem.getAttribute('name');
    const config = {
        general: {
            [configName]: status
        }
    };

    putUserConfig(config);
    loadTasks();
};

const handleChangeTheme = (e) => {

    const inputs = document.querySelectorAll('.app-options .modal-themes input');
    inputs.forEach(input => input.checked = false);

    const item = e.currentTarget;
    const groupItem = findAncestor(item, '.app-group-item');

    let theme = groupItem.getAttribute('data-theme');
    const config = {
        user_theme: {
            theme: theme
        }
    };

    if (theme === 'auto') {

        const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersColorScheme) {
            theme = 'dark';
        }
    }
    document.querySelector('html').setAttribute('theme', theme);
    item.querySelector('input').checked = true;

    // await putUserConfig(config);
    putUserConfig(config);
};

const handleSyncUserConfig = () => {

    syncUserConfig();
};
