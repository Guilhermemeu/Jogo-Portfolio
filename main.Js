//First Parameters
window.scrollTo(0, 0);

//VARIABLES
const Player = document.getElementById("player")

let _Left = 0;
let _Right = 0;

let EditButton = document.getElementById("edit-mode")

//FUNCTIONS

// GridBuild system aqui
import { get_grid_position } from "./Modules/GridModule.js";

// Movimentação e colisão do personagem
import { add_colision_data, get_collisions, MoveX, MoveY } from "./Modules/Movement.js";

//  EditMode
import { edit_mode_mousemove, edit_mode_click, enter_edit_mode } from "./Modules/EditMode.js";

// -------------------- | Events | -------------------- \\

// Escuta os inputs iniciais
document.addEventListener("keydown", (Input) => {

    let Key = Input.key.toLowerCase()

    if (Input.code === "Space") {
        Input.preventDefault();
        MoveY('Jump');
        return
    }

    switch (Key) {
        case 'a':
            _Left = 1
            break;
        case 'd':
            _Right = 1
            break;

        case 'r':
            location.reload()
            break;
    }

})

// dá clear nos inputs
document.addEventListener("keyup", (ClearInput) => {
    let Key = ClearInput.key.toLowerCase()

    switch (Key) {
        case 'a':
            _Left = 0
            break;
        case 'd':
            _Right = 0
            break;
    }
})
// Entra no modo de edição
EditButton.addEventListener("click", enter_edit_mode)
// Cria plataforma
document.addEventListener("click", edit_mode_click)
// Mexe com a preview da build
document.addEventListener("mousemove", edit_mode_mousemove)


const gameLoop = () => {
    MoveY();
    MoveX(_Left, _Right);

    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
