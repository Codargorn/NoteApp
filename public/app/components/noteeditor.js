import {createElementFromHTML} from "../html.js";
import NoteListComponent from "./notelist.js";
import NoteComponent from "./note.js";

const template = `
           <div class="row">
            <div class="col-8 offset-2">
                <div class="row mb-2 mt-2 ">
                    <div class="col-8">
                        <input type="text" class="form-control" placeholder="Title" id="note-title">
                    </div>
                    <div class="col-4">
                        <button type="button" class="btn btn-dark full_width_button border border-primary"
                                id="create-note">Create note
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <textarea class="form-control" placeholder="type your note here" id="note-text"></textarea>
                    </div>
                </div>
            </div>
            <div class="col-2"></div>
                <div class="col">
                    <hr style="margin: 20px auto 10px;  max-width: 66%">
                </div>
             </div>
        `;

/**
 * @param {NoteList} noteList
 * @param {HTMLElement} $element
 * @param {Store} store
 */
function mount(noteList, $element, store){

    const $editor =   createElementFromHTML(template);

    $editor.querySelector('#create-note').addEventListener('click',_ => {
        let note = new NoteComponent.Note(
            $editor.querySelector('#note-title').value,
            $editor.querySelector('#note-text').value
        )
        note.addTo(noteList)

        store.setItem('notes', noteList.toJSON())
        const $notes = document.querySelector('.notes');
        NoteListComponent.mount(store, noteList, $notes)
    })



    $element.appendChild($editor);
}

const NoteEditorComponent = {
    mount
}

export default NoteEditorComponent