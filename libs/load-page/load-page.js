class LoadPage {
    #config = {};
    constructor(config) {
        this.#config.interaction = config && config.interaction ? config.interaction : false;
        this.#config.primary_color = config && config.primary_color ? config.primary_color : '#3f6fca';
        this.#config.secundary_color = config && config.secundary_color ? config.secundary_color : 'rgb(113, 114, 187)';
        this.#config.background_color = config && config.background_color ? config.background_color : '#ddd';

        this.#applyConfig();

    }
    #create(htmlStr) {
        let frag = document.createDocumentFragment(),
        temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    }
    #applyConfig() {
        const r = document.querySelector(':root');
        r.style.setProperty('--loadPage-primary-color', `${this.#config.primary_color}`);
        r.style.setProperty('--loadPage-secundary-color', `${this.#config.secundary_color}`);
        r.style.setProperty('--loadPage-background-color', `${this.#config.background_color}`);
    }
    show() {
        if (document.getElementById('load-container')) return;
        const fragment = this.#create(`<div id="load-container" style="pointer-events: ${this.#config.interaction ? 'none' : 'all'}"><div class="load-page"><p class="load-page-item sloading"></p></div></div>`);
        document.body.insertBefore(fragment, document.body.childNodes[0]);
    }
    remove() {
        const $load = document.getElementById('load-container');

        $load.style.opacity = '0';
        setTimeout(() => $load.remove(), 500);
    }
}