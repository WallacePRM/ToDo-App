
let popupConfig = {
    last_position: {},
    height: 82,
};
const createPopup = (contentHtml) => {

    let isActive = false;
    if (document.querySelectorAll('#popup').length > 0) {
        isActive = true;
    }
    else {
        popupConfig.last_position = {};
    }
    removePopup();

    popupConfig.height = contentHtml.querySelectorAll('.popup-item').length * 41;

    const app = document.querySelector('.app');
    const popup = document.createElement('div');
    popup.setAttribute('id', 'popup');
    popup.classList.add('view-template');
    isActive ? popup.classList.add('active') : '';
    isActive ? popup.style.height = popupConfig.height + 'px' : '';
    popup.appendChild(contentHtml);

    if (popupConfig.last_position && popupConfig.last_position.top) {
        popup.style.top = popupConfig.last_position.top + 'px';
        popup.style.left = popupConfig.last_position.left + 'px';
    }

    setTimeout(() => document.addEventListener('click', handleRemovePopup, 10));
    app.insertAdjacentElement('beforeend', popup);
};

const showPopup = (e) => {
    const popup = document.querySelector('#popup');
    const screen = document.querySelector('.main-frame');

    let top = e.clientY;
    let left = e.clientX;
    if ((left + popup.offsetWidth) > screen.offsetWidth) {
        left = left - popup.offsetWidth;
    }

    popupConfig.last_position = {top, left};

    setTimeout(() => {
        popup.classList.add('active');

        popup.style.height = popupConfig.height + 'px';
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
    }, 10);
};

const removePopup = () => {
    if (document.querySelectorAll('#popup').length === 0) return;
    const popup = document.querySelector('#popup');
    popup.remove();

    document.removeEventListener('click', handleRemovePopup);
};

const handleRemovePopup = (e) => {

    const el = findAncestor(e.target, '#popup');
    if (el) {
        return;
    }
    removePopup();
};