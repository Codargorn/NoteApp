import NoteComponent from "./note.js";
import note from "./note.js";

/**
 *
 * @param {Note[]} notes
 * @constructor
 */
function NoteList(notes = []) {

    for(let i=0; i < notes.length; i++)
    {
        notes[i].noteList = this;
    }

    /**
     * @param {Note} note
     */
    this.delete = function (note) {
        const index = notes.indexOf(note)

        notes.splice(index, 1);
    }

    /**
     * @param {Note} note
     */
    this.addNote = function (note) {
        note.noteList = this;
        note.createdAt = new Date()
        notes.push(note);
    }

    this.toJSON = function (){
        const list = [];
        for(let i=0; i < notes.length; i++)
        {
            list.push( {
                title: notes[i].title,
                text: notes[i].text,
                createdAt: notes[i].createdAt.toString()
            });
        }

        return JSON.stringify(list);
    }

    this.fromJSON = function (json)
    {
        notes = [];

        const list = JSON.parse(json);
        for(let i=0; i < list.length; i++)
        {
            const serializedNote = list[i];
            const note = new NoteComponent.Note(
                serializedNote.title,
                serializedNote.text
            );
            note.createdAt =  new Date(serializedNote.createdAt)
            note.noteList = this;

           notes.push(note);
        }

        return this;
    }

    this.notes=function ()
    {
        return notes;
    }
}

/**
 * @param {Store} store
 * @param {NoteList} noteList
 * @param {HTMLElement} $element
 * * @returns HTMLElement
 */
function mount(store, noteList, $element)
{



    const json = store.getItem('notes');

    if ( json )
    {
        noteList.fromJSON(json);
    }

    for (let i in noteList.notes()) {
        /**
         * @type {Note}
         */
        const note = noteList.notes()[i];
        NoteComponent.mount(note, $element)
    }

    $element.querySelectorAll('.change-note').forEach(element => {
        element.addEventListener('click', _ => {

            store.setItem('notes',noteList.toJSON())
            render(store, noteList, $element)
        });
    });

    $element.querySelectorAll('.delete-note').forEach(element => {
        element.addEventListener('click', _ => {

            store.setItem('notes',noteList.toJSON())
            render(store, noteList, $element)
        });
    });

    document.getElementById('createButton').addEventListener('click', () => {
        let note = new NoteComponent.Note(
            document.getElementById('inputTitle').value,
            document.getElementById('inputText').value
        )
        note.addTo(noteList)

        store.setItem('notes',noteList.toJSON())
        render(store, noteList, $element)
    })
}

/**
 * @param {Store} store
 * @param noteList
 * @param $element
 */
function render(store, noteList, $element)
{
    $element.innerHTML = '';
    mount(store, noteList, $element);
}

const NoteListComponent = {
    NoteList,
    mount
}

export default NoteListComponent;