// Variables

let dragging

let MouseX = 0
let MouseY = 0

let posX
let posY

let objeto

// Aqui vou colocar grande parte dos comportamento por classe do css

// Mouse interactions

// getting variable for mouse Interactions
document.addEventListener("mousemove", (event) => {
    MouseX = event.clientX
    MouseY = event.clientY
})

function drag_node() {

    objeto.style.left = (MouseX - posX) + "px"
    objeto.style.top = (MouseY - posY) + "px"


    if (!dragging) {
        document.removeEventListener("mousemove", drag_node)
    }
}

document.addEventListener("mousedown", (evento) => {
    // procurar interações por classe
    objeto = evento.target
    if (objeto.classList.contains("movable")) {
        console.log("tenho a class movable")
        dragging = true

        posX = MouseX - parseInt(objeto.style.left)
        posY = MouseY - parseInt(objeto.style.top)

        document.addEventListener("mousemove", drag_node)
    }

})

document.addEventListener("mouseup", () => {
    dragging = false
})