import { GameEditor } from "./GameEditor";

const createApp = () => {
    const container = document.createElement('div');
    container.innerHTML = `
    <label for="level-name">Level Name:&nbsp</input><input type="text" id="level-name" />
    <br />
    <br />
    <div id="app-container"></div>
    <br />
    <button id="app-save">Save Level</button>
    `;

    document.body.appendChild(container);
    return container;
}

async function main() {
    const app = createApp();
    const parent = app.querySelector('#app-container')! as HTMLElement;
    const editor = new GameEditor(parent);

    const titleInput = app.querySelector('#level-name')! as HTMLInputElement;

    const saveButton = app.querySelector('#app-save')!;
    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        const data = editor.export();
        data.title = titleInput.value;
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.download = data.title + '.json';
        a.href = URL.createObjectURL(blob);
        a.click();
    });

    editor.start();
}
main();
