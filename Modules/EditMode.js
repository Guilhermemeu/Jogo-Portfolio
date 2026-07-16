
import { get_grid_position } from "./GridModule.js";
import { get_collisions, add_colision_data, remove_colision_data } from "./Movement.js";

let TotalClicksEdit = 0;

let BuildPreview = document.getElementById("build-preview");

let OldMXIG = 0;
let OldMYIG = 0;
let LastElement = false;

let NewElementId = 1;

let FloorContainer = document.getElementById("floor-container");
let OpenTabs = document.getElementById("open-tabs")

let CanBuild = true;

let EditMode = false;

let MouseX = 0
let MouseY = 0

// getting variable for mouse Interactions
document.addEventListener("mousemove", (event) => {
    MouseX = event.clientX
    MouseY = event.clientY
})

//  entra no edit mode
let editWindow

function update_edit_window() {
    let cb = document.getElementById('create-button')
    let rb = document.getElementById('remove-button')
    let sb = document.getElementById('select-button')

    cb.classList.remove("Active")
    rb.classList.remove("Active")
    sb.classList.remove("Active")


    switch (EditMode) {
        case "Create":
            cb.classList.add("Active")
            break;
        case "Delete":
            rb.classList.add("Active")
            break;
        case "Select":
            sb.classList.add("Active")
            break;

        default:
            alert("not working btw")
            break
    }
}
let edit_buttons_press = null   

function open_edit_window() {
    if (editWindow) {
        editWindow.remove()
        editWindow = false
        return
    }

    let NewElement = `
    <div class='edit-window' id="${NewElementId}" style="position:absolute; left:500px;" >
        <div class='create-button' id='create-button'>
        crio
        </div>
        <div class='remove-button' id='remove-button'>
        removo
        </div>
        <div class='select-button' id='select-button'>
        mexo
        </div>
    </div>
    `
    OpenTabs.insertAdjacentHTML('beforeend', NewElement)

    editWindow = document.getElementById(String(NewElementId))
    NewElementId += 1

    edit_buttons_press = (event) => {
        LastElement.remove()
        console.log(event.target.id)
        event = event.target.id
        if (event == 'create-button') {
            EditMode = "Create"
            update_edit_window()
        }
        if (event == 'remove-button') {
            EditMode = "Delete"
            update_edit_window()
        }
        if (event == 'select-button') {
            EditMode = "Select"
            update_edit_window()
        }
        document.removeEventListener("click", edit_buttons_press)
    }
    editWindow.addEventListener("click", edit_buttons_press)

    update_edit_window()

}

export function enter_edit_mode() {
    if (EditMode != false) {
        EditMode = false;

        open_edit_window()
        remove_colision_data(NewElementId)

        LastElement.remove()
        TotalClicksEdit = 0
        return;
    }
    if (EditMode == false) {
        EditMode = "Create";

        open_edit_window()


        TotalClicksEdit += 1
        return;
    }
}

export function edit_mode_mousemove() {

    if (EditMode == false) {
        return
    }

    switch (EditMode) {
        case "Create":

            let MouseXInGrid = get_grid_position(MouseX + window.scrollX, 128);
            let MouseYInGrid = get_grid_position(MouseY + window.scrollY, 128);


            if (MouseXInGrid != OldMXIG || MouseYInGrid != OldMYIG) {

                if (LastElement) {
                    LastElement.remove()
                }
                OldMXIG = MouseXInGrid;
                OldMYIG = MouseYInGrid;

                // Criação e indexação
                let NewElement = document.createElement("div")
                NewElement.id = "BuildPreview"

                //Estilo e Posição
                NewElement.classList.add("build-preview");
                NewElement.style.left = MouseXInGrid + 'px'
                NewElement.style.top = MouseYInGrid + 'px'
                NewElement.style.width = 128 + 'px'
                NewElement.style.height = 128 + 'px'

                let Collisions = get_collisions()
                for (let Object in Collisions) {
                    let v = Collisions[Object]

                    if (Math.floor(v.Top) === MouseYInGrid && Math.floor(v.Left) === MouseXInGrid) {
                        console.log("it's in the same position")
                        CanBuild = false
                        NewElement.style.backgroundColor = "red"
                        BuildPreview.appendChild(NewElement)

                        break;
                    } else {
                        CanBuild = true;
                    }
                }
                BuildPreview.appendChild(NewElement)

                LastElement = document.getElementById("BuildPreview")
                OldMXIG = MouseXInGrid;
                OldMYIG = MouseYInGrid;

            }
            break;
    }
}
// Funções do click aqui

// cria janela
function create_window() {
    if (CanBuild === false) {
        return false;
    }

    const check = document.getElementById('BuildPreview');
    if (!check) {
        return false;
    }

    const isHovered = check.matches(':hover');
    if (!isHovered) {
        return false;
    }

    //Estilo e Posição
    let width = 128
    let height = 128

    let left = ((get_grid_position(MouseX + window.scrollX, width))) + 'px'
    let top = ((get_grid_position(MouseY + window.scrollY, height))) + 'px'

    // Criação e indexação
    let NewElement = `
            <div class="basic-block" id="${NewElementId}" style="position: absolute; left:${left}; top:${top};" name="Sample">
            </div>
            `

    FloorContainer.insertAdjacentHTML('beforeend', NewElement)

    let Element = document.getElementById(String(NewElementId))

    add_colision_data(Element)
    NewElementId += 1

    CanBuild = false
    return true
}

// fecha janela
let click_to_delete = null
function delete_window() {

    click_to_delete = (event) => {
        console.log(event.target)

        document.removeEventListener("click", click_to_delete)
    }
    document.addEventListener("click", click_to_delete)
}


export function edit_mode_click() {

    if (EditMode == false) {
        return
    }
    if (TotalClicksEdit <= 1) {
        TotalClicksEdit += 1
        return
    }
    switch (EditMode) {
        case "Create":
            if (create_window()) {
                console.log("Construiu")
            } else {
                console.log("Não Construiu")
            }
            break;
        case "Delete":
            if (delete_window()) {
                console.log("Deletou")
            } else {
                console.log("Não Deletou")
            }
            break;
        case "Select":
            break;

        default:
            alert("Mode Not Detected")
            break
    }

}
