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
                <button class="fas fa-angle-down align-bottom input-group-text collapsible"></button>
                <input type="text" class="form-control input-group-text" placeholder="Title">
                <button type="button" class="fas fa-edit btn btn-dark border border-primary change-note"></button>
                <button type="button"
                        class="far fa-trash-alt btn btn-danger border border-primary delete-note"></button>
            </div>
            <div class="row">
                <div class="col"><textarea class="form-control mb-2" placeholder="type your note here" rows="10"
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

    /*const $note =   createElementFromHTML(template);

    $element.appendChild($note);
    */
    let firstrowdiv = document.createElement('div')
    firstrowdiv.className = 'row mb-2 mt-2 note'

    let firstcol2div = document.createElement('div')
    firstcol2div.className = 'col-2'

    let col8div = document.createElement('div')
    col8div.className = 'col-8'

    let firstcol6div = document.createElement('div')
    firstcol6div.className = 'col'

    let inputgroupdiv = document.createElement('div')
    inputgroupdiv.className = 'input-group  mb-1'

    let textarea = document.createElement('textarea')
    textarea.className = 'form-control mb-2'
    textarea.placeholder = 'type your note here'
    textarea.style.display = 'none'
    textarea.value = note.text
    textarea.rows = 10;

    let htmlView = document.createElement('div');
    htmlView.className = 'html-view p-2';
    htmlView.style.display = 'none';
    htmlView.innerHTML = marked(note.text);


    let collapsebutton = document.createElement('button')
    collapsebutton.className = 'fas fa-angle-down align-bottom input-group-text collapsible'
    collapsebutton.addEventListener('click', function () {
        this.classList.toggle('active');
        if (textarea.style.display === "block") {
            textarea.style.display = "none"
        } else {
            textarea.style.display = "block"
        }
    })

    collapsebutton.addEventListener('mouseover', _ => {
        htmlView.style.display = 'block';
    });

    // let icon = document.createElement('i')


    let input = document.createElement('input')
    input.type = 'text'
    input.className = 'form-control input-group-text'
    input.placeholder = 'Title'
    input.value = note.title

    input.addEventListener('mouseover', _ => {
        htmlView.style.display = 'block';
    });

    input.addEventListener('mouseout', e => {
        htmlView.style.display = 'none';
    });


    let changebutton = document.createElement('button')
    changebutton.type = 'button'
    changebutton.className = 'fas fa-edit btn btn-dark border border-primary change-note'
    changebutton.addEventListener('click', _ => {
        note.title = input.value;
        note.text = textarea.value;
    });


    let deletebutton = document.createElement('button')
    deletebutton.type = 'button'
    deletebutton.className = 'far fa-trash-alt btn btn-danger border border-primary delete-note'
    deletebutton.addEventListener('click', _ => {
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
    col8div.appendChild(inputgroupdiv)
    inputgroupdiv.appendChild(collapsebutton)
    inputgroupdiv.appendChild(input)
    inputgroupdiv.appendChild(changebutton)
    inputgroupdiv.appendChild(deletebutton)
    col8div.appendChild(secondrowdiv)
    secondrowdiv.appendChild(coldiv)
    coldiv.appendChild(textarea)
    coldiv.appendChild(htmlView)
    firstrowdiv.appendChild(secondcol2div)

    $element.appendChild(firstrowdiv)

}

const NoteComponent = {
    Note,
    mount
}

export default NoteComponent;