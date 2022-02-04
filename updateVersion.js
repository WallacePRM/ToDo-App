// Atualizar a versão do site no HTML
const fs = require('fs');

const date = new Date();
const year = date.getFullYear() - 2000;
const month = date.getMonth() + 1;
const day = date.getDate();
const version = `v${year}.${month}.${day}`;

let mainHtml = fs.readFileSync('./index.html', 'utf8');
mainHtml = mainHtml.replace(/<span class="app-version">[\w.]+<\/span>/g, `<span class="app-version">${version}</span>`);

fs.writeFileSync('./src/main.html', mainHtml, 'utf8');