import {createElementFromHTML} from "../html.js";

class Note {
    constructor(title, text) {
        this.title = title;
        this.text = text;
        this.createdAt = new Date();

        this.noteList = null;
    }

    delete() {
        this.noteList.delete(this);
    }

    addTo(noteList) {
        noteList.add(this);
    }
}

// language=HTML
const template = `
    <div class="row mb-2 mt-2 note">
        <div class="col-2"></div>
        <div class="col-8">
            <div class="input-group  mb-1">
                <button class="fas fa-angle-down align-bottom input-group-text collapsible collapsibleButton"></button>
                <input type="text" class="form-control input-group-text inputField" placeholder="Title">
                <button type="button" class="fas fa-edit btn btn-dark border border-primary change-note"></button>
                <button type="button"
                        class="far fa-trash-alt btn btn-danger border border-primary delete-note"></button>
            </div>
            <div class="row">
                <div class="col"><textarea class="form-control mb-2 textarea" placeholder="type your note here" rows="10"
                                           style="display: none;"></textarea>
                    <div class="html-view p-2" style="display: none;">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-2"></div>
    </div>`;

/**
 *
 * @param {Note} note
 * @param {HTMLElement} $element
 */
function mount(note, $element) {

    const $note = createElementFromHTML(template);


    let collapsibleButton = $note.querySelector('.collapsibleButton');

    let htmlView = $note.querySelector('.html-view');

    let textarea = $note.querySelector('.textarea');

    let input = $note.querySelector('.inputField');

    collapsibleButton.addEventListener('click', function () {
            this.classList.toggle('active');
            if (textarea.style.display === "block") {
                textarea.style.display = "none"
            } else {
                textarea.style.display = "block"
            }
        }
    );
    collapsibleButton.addEventListener('mouseover', _ => {
        htmlView.style.display = 'block';
    });
    textarea.value = note.text;
    htmlView.innerHTML = marked(note.text);

    input.value = note.title;
    input.addEventListener('mouseover', _ => {
        htmlView.style.display = 'block';
    });

    input.addEventListener('mouseout', e => {
        htmlView.style.display = 'none';
    });

    $note.querySelector('.change-note').addEventListener('click', _ => {
        note.title = input.value;
        note.text = textarea.value;
    });

    $note.querySelector('.delete-note').addEventListener('click', _ => {
        note.delete();
    });

    $element.appendChild($note);

}

const NoteComponent = {
    Note,
    mount
}

export default NoteComponent;