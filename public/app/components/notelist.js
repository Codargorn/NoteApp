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
    this.add = function (note) {
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
 */
function mount(store, noteList, $element)
{
    const json =  store.getItem('notes');

    if ( json )
    {
        noteList.fromJSON(json);
    }

    $element.querySelectorAll('.note').forEach(note => {
        note.remove();
    });

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
            mount(store, noteList, $element)
        });
    });

    $element.querySelectorAll('.delete-note').forEach(element => {
        element.addEventListener('click', _ => {

            store.setItem('notes',noteList.toJSON())
            mount(store, noteList, $element)
        });
    });
}

const NoteListComponent = {
    NoteList,
    mount
}

export default NoteListComponent;