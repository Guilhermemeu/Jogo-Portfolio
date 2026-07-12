
import { get_grid_position } from "./GridModule.js";
import { get_collisions, add_colision_data } from "./Movement.js";

let TotalClicksEdit = 0;

let BuildPreview = document.getElementById("build-preview");

let OldMXIG = 0;
let OldMYIG = 0;
let LastElement = false;

let NewElementId = 1;
let FloorContainer = document.getElementById("floor-container");
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

export function enter_edit_mode() {
    if (EditMode != false) {
        EditMode = false;
        LastElement.remove()
        TotalClicksEdit = 0
        return;
    }
    if (EditMode == false) {
        EditMode = "Create";
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

const BuildTab = `</div>`
// `
//             <div style="display: flex; flex-direction:column;">
//                     <div style="display: flex;">
//                         <img class="top-box-1" src="Sprites/Instances/Window01/corner1window.png">
//                         <img src="Sprites/Instances/Window01/width1window.png">
//                         <img src="Sprites/Instances/Window01/corner2window.png">
//                     </div>
//                     <div style="display: flex;">
//                         <img class="mid-box-1" src="Sprites/Instances/Window01/heightwindow.png">
//                         <img class="mid-box-2" src="Sprites/Instances/Window01/contentwindow.png">
//                         <img class="mid-box-1" src="Sprites/Instances/Window01/heightwindow.png">
//                     </div>
//                     <div style="display: flex;">
//                         <img src="Sprites/Instances/Window01/corner3window.png">
//                         <img class="low-box-1" src="Sprites/Instances/Window01/width2window.png">
//                         <img src="Sprites/Instances/Window01/corner4window.png">
//                     </div>
//                 </div>
//             </div>
//             `


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

            if (CanBuild === false) { break; }


            //Estilo e Posição
            let width = 128
            let height = 128

            let left = ((get_grid_position(MouseX + window.scrollX, width))) + 'px'
            let top = ((get_grid_position(MouseY + window.scrollY, height))) + 'px'

            // Criação e indexação
            let NewElement = `
            <div class="basic-block" id="${NewElementId}" style="position: absolute; left:${left}; top:${top};" name="Sample">
            `+ BuildTab;

            FloorContainer.insertAdjacentHTML('beforeend', NewElement)

            let Element = document.getElementById(String(NewElementId))

            add_colision_data(Element)
            NewElementId += 1

            CanBuild = false
            break;
        case "Delete":
            break;
        case "Stretch":
            break;

        default:
            alert("Mode Not Detected")
            break
    }

}
