document.addEventListener('DOMContentLoaded', async () => {
    window.loadPage = new LoadPage({interaction: false, background_color: 'rgba(var(--border-color))', primary_color: `rgba(var(--light-blue-color))`, secundary_color: `rgba(var(--blue-color))` });

    await getUserInfo();
    setTheme();

    render();
    initTask();
    setHeaderTransparent(document.querySelector('.task-view .content'));
}, false);