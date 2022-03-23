let userConfig = null;

const postAccountRegister = (name, email, password) => {

    return postJson(urlApi + '/account/create', {
        name: name,
        email: email,
        password: password
    }, false);
};

const accountLogin = (email, password) => {

    return postJson(urlApi + '/account/login', {
        email: email,
        password: password
    }, false);
};

const getUserInfo = () => {

    // const userData = await getJson(urlApi + `/account/me`, true);
    const config = JSON.parse(localStorage.getItem('userConfig'));
    const defaultConfig = {
        general: {
            sound_notify: true,
            confirm_exclusion: false,
            task_important_top: true,
            new_task_top: false
        },
        user_theme: {
            theme: 'auto',
            accent_color: '5, 100, 240',
            modal_opacity: '0.8',
        }
    };

    const userData = {
        name: 'Wallace PRM',
        email: 'wprm4work@hotmail.com',
        config: config || defaultConfig
    }
    userConfig = userData.config;

    return Promise.resolve(userData);
};

const putUserConfig = async (config) => {

    // await putJson(urlApi + '/account/config', config, true);
    userConfig = {
        ...userConfig,
        ...config,
        general: {
            ...userConfig.general,
            ...config.general
        },
        user_theme: {
            ...userConfig.user_theme,
            ...config.user_theme
        }
    };

    localStorage.setItem('userConfig', JSON.stringify(userConfig));

    return;
};

const getUserConfig = () => {
    return userConfig;
};
