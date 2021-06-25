import NoteListComponent from "./notelist.js";



class Note {
    constructor(title, text) {
        this.title = title;
        this.text = text;
        this.createdAt = new Date();

        this.noteList = null;
    }

    delete()
    {
        this.noteList.delete(this);
    }

    addTo(noteList)
    {
        noteList.addNote(this);
    }
}

/**
 *
 * @param {Note} note
 * @param {HTMLElement} $element
 */
function mount(note, $element)
{
    let firstrowdiv =document.createElement('div')
    firstrowdiv.className = 'row'

    let firstcol2div = document.createElement('div')
    firstcol2div.className = 'col-2'

    let col8div = document.createElement('div')
    col8div.className ='col-8'

    let rowmb2div = document.createElement('div')
    rowmb2div.className = 'row mb-2 mt-2'

    let firstcol6div = document.createElement('div')
    firstcol6div.className = 'col-6'

    let inputgroupdiv = document.createElement('div')
    inputgroupdiv.className = 'input-group'

    let textarea = document.createElement('textarea')
    textarea.className = 'form-control'
    textarea.placeholder = 'type your note here'
    textarea.style.display = 'none'
    textarea.value = note.text

    let collapsebutton = document.createElement('button')
    collapsebutton.className = 'fas fa-angle-down align-bottom input-group-text collapsible'
    collapsebutton.addEventListener('click', function (){
        this.classList.toggle('active');
        if (textarea.style.display === "block") {
            textarea.style.display = "none"
        } else {
            textarea.style.display = "block"
        }
    })

        // let icon = document.createElement('i')


    let input = document.createElement('input')
    input.type = 'text'
    input.className = 'form-control input-group-text'
    input.placeholder = 'Title'
    input.value = note.title

    let secondcol6div = document.createElement('div')
    secondcol6div.className = 'col-6'

    let groupboxdiv = document.createElement('div')
    groupboxdiv.className = "btn-group buttonGroup"

    let changebutton = document.createElement('button')
    changebutton.type = 'button'
    changebutton.className = 'btn btn-dark full_width_button border border-primary change-note'
    changebutton.innerHTML = 'Change Note'
    changebutton.addEventListener('click', _ => {
        note.title = input.value;
        note.text = textarea.value;
    });


    let deletebutton = document.createElement('button')
    deletebutton.type = 'button'
    deletebutton.className = 'btn btn-danger full_width_button border border-primary delete-note'
    deletebutton.innerHTML = 'Delete note'
    deletebutton.addEventListener('click', _=>{
        note.delete();
    });

    let secondrowdiv = document.createElement('div')
    secondrowdiv.className = 'row'

    let coldiv = document.createElement('div')
    coldiv.className = 'col'



    let secondcol2div = document.createElement('div')
    secondcol2div.className = 'col-2'



    firstrowdiv.appendChild(firstcol2div)
    firstrowdiv.appendChild(col8div)
    col8div.appendChild(rowmb2div)
    rowmb2div.appendChild(firstcol6div)
    firstcol6div.appendChild(inputgroupdiv)
    inputgroupdiv.appendChild(collapsebutton)
    inputgroupdiv.appendChild(input)
    rowmb2div.appendChild(secondcol6div)
    secondcol6div.appendChild(groupboxdiv)
    groupboxdiv.appendChild(changebutton)
    groupboxdiv.appendChild(deletebutton)
    col8div.appendChild(secondrowdiv)
    secondrowdiv.appendChild(coldiv)
    coldiv.appendChild(textarea)
    firstrowdiv.appendChild(secondcol2div)


    $element.appendChild(firstrowdiv)
}

const NoteComponent = {
    Note,
    mount
}

export default NoteComponent;