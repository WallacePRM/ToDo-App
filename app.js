const render = () => {

    const app = document.querySelector('.app');
    app.innerHTML = `
        <main class="main-frame view-template noselect" show-modal-task="false">
            <div class="task-view" header-top="true">
                <header>
                    <div>
                        <h1>To Do</h1>
                        <span>Organize suas tarefas diárias</span>
                    </div>
                    <div>
                        <i name="btn_app_options" class="btn-icon btn-ripple ti-more-alt" title="Opções"></i>
                    </div>
                </header>
                <div class="content">
                    <div class="toDo-list">
                        <div class="toDo-list-title">
                            <i class="fas fa-tasks"></i>
                            <h3>Tarefas</h3>
                        </div>
                        <div class="toDo-tasks-list"></div>
                    </div>
                </div>
                <div class="toDo-actions">
                    <form>
                        <div class="toDo-actions-item">
                            <i class="ti-plus"></i>
                            <input name="btn_add_task" type="text" placeholder="Adicionar uma tarefa">
                        </div>
                    </form>
                </div>
            </div>
        </main>
    `;

    app.querySelector('[name="btn_app_options"]').addEventListener('click', handleShowAppConfig);
};

const createAppOptions = () => {

    const options = document.createElement('div');
    options.innerHTML = `
        <div class="popup-item accent-color-label">
            <span>Cor de destaque</span>
        </div>
        <div class="popup-item accent-color">
            <div data-color="5, 100, 240" class="accent-color-item active" style="background: rgba(var(--blue-color), .8)"></div>
            <div data-color="233, 64, 41" class="accent-color-item" style="background: rgba(var(--red-color), .8)"></div>
            <div data-color="236, 184, 41" class="accent-color-item" style="background: rgba(var(--yellow-color), .8)"></div>
            <div data-color="120, 120, 240" class="accent-color-item" style="background: rgba(var(--purple-color), .8)"></div>
            <div data-color="0, 184, 30" class="accent-color-item" style="background: rgba(var(--green-color), .8)"></div>
        </div>
        <div class="popup-item accent-color">
            <div data-color="113, 114, 187" class="accent-color-item" style="background: rgba(var(--light-purple-color), .8)"></div>
            <div data-color="255, 138, 122" class="accent-color-item" style="background: rgba(var(--light-red-color), .8)"></div>
            <div data-color="255, 48, 135" class="accent-color-item" style="background: rgba(var(--pink-color), .8)"></div>
            <div data-color="50, 175, 240" class="accent-color-item" style="background: rgba(var(--light-blue-color), .8)"></div>
            <div data-color="255, 95, 58" class="accent-color-item" style="background: rgba(var(--orange-color), .8)"></div>
        </div>
        <div class="popup-item modal-opacity-label">
            <span>Alterar a opacidade do modal</span>
        </div>
        <div class="popup-item modal-opacity-action">
           <input class="slider" value="0.9" type="range" min="0" max="1" step="0.05"/>
        </div>
        <div name="btn_app_config" class="popup-item">
            <i class="ti-settings"></i>
            <span>Configurações</span>
        </div>
         <div name="btn_app_sync" class="popup-item">
            <i class="ti-reload"></i>
            <span>Sincronizar</span>
        </div>
    `;

    const colors = options.querySelectorAll('.accent-color-item');
    colors.forEach(color => color.addEventListener('click', handleChangeAccentColor));

    options.querySelector('.slider').addEventListener('change', handleChangeModalOpacity);
    options.querySelector('[name="btn_app_config"]').addEventListener('click', handleShowModalApp);
    options.querySelector('[name="btn_app_sync"]').addEventListener('click', handleAppSync);

    setAppOptionsConfig(options);
    createPopup(options);
};

const setHeaderTransparent = (scrollElement) => {
    scrollElement.addEventListener('scroll', () => {

        const taskView = document.querySelector('.task-view');
        const header = document.querySelector('.task-view header');
        if (scrollElement.scrollTop > 0) {
            taskView.setAttribute('header-top', 'false');
            const height = header.offsetHeight;
            scrollElement.style.paddingTop =  height + 'px';
        }
        else {
            taskView.setAttribute('header-top', 'true');
            scrollElement.style.paddingTop = '0px';
        }
    });
};

const setTheme = () => {

    const config = getUserConfig();
    let theme = config.user_theme.theme;
    if (theme === 'auto') {

        const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersColorScheme) {
            theme = 'dark';
        }
    }
    document.querySelector('html').setAttribute('theme', theme);

    const r = document.querySelector(':root');
    r.style.setProperty('--accent-color', config.user_theme.accent_color);
};

const setAppOptionsConfig = (options) => {

    const config = getUserConfig();

    // ACCENT COLOR
    const colors = options.querySelectorAll('.accent-color-item');
    colors.forEach(color => color.classList.remove('active'));

    const colorItem = options.querySelector(`[data-color="${config.user_theme.accent_color}"]`);
    colorItem.classList.add('active');

    // MODAL OPACITY
    const input = options.querySelector('.slider');
    input.value = config.user_theme.modal_opacity;
};

// HANDLES
const handleShowAppConfig = (e) => {

    createAppOptions();
    showPopup(e);
};

const handleShowModalApp = () => {

    createModalApp();
    setTimeout(() => showModalApp(), 10);
    removePopup();

    addButtonRipple(document.querySelector('.modal-app-options'));
};

const handleChangeModalOpacity = (e) => {

    console.log('1');
    const opacity = parseFloat(e.currentTarget.value);
    if (document.querySelectorAll('.modal-task').length > 0) {

        const modal = document.querySelector('.modal-task');
        modal.style.background = `linear-gradient(to top, rgba(var(--secundary-color), ${opacity}), rgba(var(--secundary-color), ${opacity + 0.1}))`;

        if (document.querySelectorAll('[theme="light"]').length > 0) {
            modal.querySelector('footer').style.color = opacity < 0.4 ? '#fff' : null;
        }
    }

    const config = {
        user_theme: {
            modal_opacity: opacity
        }
    };
    putUserConfig(config);
};

const handleChangeAccentColor = (e) => {

    const colors = document.querySelectorAll('#popup .accent-color-item');
    colors.forEach(color => color.classList.remove('active'));

    const color = e.currentTarget.getAttribute('data-color');
    const r = document.querySelector(':root');
    r.style.setProperty('--accent-color', color);

    e.currentTarget.classList.add('active');

    const config = {
        user_theme: {
            accent_color: color
        }
    };
    putUserConfig(config);
};

const handleAppSync = () => {

    loadPage.show();

    syncUserConfig();
    removePopup();

    setTimeout(() => loadPage.remove(), 1000);
};