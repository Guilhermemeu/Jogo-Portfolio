let posX = 950;
let posY = 0;

let Player = document.getElementById("player")

let Collisions = []

export function get_collisions() {
    return Collisions;
}

// Adiciona à array a nova colisão
export function add_colision_data(_Key) {
    if (_Key === null) {
        alert("_Key não encontrada")
        return
    }
    let _KeySizes = _Key.getBoundingClientRect()

    let CurrentScrollX = window.scrollX
    let CurrentScrollY = window.scrollY


    Collisions.push({
        Id: _Key.id,
        Top: _KeySizes.top + CurrentScrollY,
        Bottom: _KeySizes.bottom + CurrentScrollY,
        Left: _KeySizes.left + CurrentScrollX,
        Right: _KeySizes.right + CurrentScrollX
    })
    console.log(Collisions)
}

//Adicionar colisões iniciais aqui
let BaseFloor = document.getElementById("floor");
add_colision_data(BaseFloor)

//Fim colisões

function check_colisions(Side, PlayerPosition) {
    switch (Side) {
        case "top":
            for (let i = 0; i < Collisions.length; i++) {
                let Value = Collisions[i]
                if (PlayerPosition <= Value.Bottom) continue;
                return Value
            }
            return null;
            break
        case "bottom":

            for (let i = 0; i < Collisions.length; i++) {
                let Value = Collisions[i]
                if (PlayerPosition >= Value.Top) continue;
                return Value
            }
            return null;
            break
        case "left":
            for (let i = 0; i < Collisions.length; i++) {
                let Value = Collisions[i]
                if (PlayerPosition <= Value.Right) continue;
                return Value
            }
            return null
            break
        case "right":
            for (let i = 0; i < Collisions.length; i++) {
                let Value = Collisions[i]
                if (PlayerPosition >= Value.Left) continue;
                return Value
            }
            return null
            break

        default:
            alert("Using this function wrong")
            break;
    }
}


const PlayerWidth = Player.offsetWidth;
const PlayerHeight = Player.offsetHeight;

// Função do calculo de colisão
export function place_meeting(offsetX, offsetY) {

    const Pleft = posX + offsetX
    const Pright = posX + PlayerWidth + offsetX
    const Ptop = posY + offsetY
    const Pbottom = posY + PlayerHeight + offsetY

    // objetivo aqui é verificar a colisão de acordo com offset para otimizar
    // Ideia 1: criar switch case com loops for
    // Ideia 2: fazer a mesma coisa do 1 só que com funções de fora

    if (offsetX) {
        if (offsetX > 0) {
            check_colisions("right", Pright)
        }
        if (offsetX < 0) {
            check_colisions("left", Pleft)
        }
    }
    if (offsetY) {
        if (offsetY > 0) {
            check_colisions("bottom", Pbottom)
        }
        if (offsetY < 0) {
            check_colisions("top", Ptop)
        }
    }
}

//     for (let i = 0; i < Collisions.length; i++) {
//         const Value = Collisions[i]
//         if (
//             Pbottom <= Value.Top ||
//             Ptop >= Value.Bottom ||
//             Pright <= Value.Left ||
//             Pleft >= Value.Right
//         ) continue;

//         return Value
//     }
//     return null
// }

let Hspd = 0
let Speed = 4

// common player movement

// movement do player na direção X 
// OBS: esta ficando lento a cada colisão por conta do for do place_meeting()
export function MoveX(_Left, _Right) {
    let Xdir = -_Left + _Right;
    Hspd = Xdir * Speed;

    const hit = place_meeting(Hspd, 0);
    if (hit) {
        if (Hspd > 0) {
            posX = hit.Left - PlayerWidth;
        } else {
            posX = hit.Right;
        }
        Hspd = 0;
    } else {
        posX += Hspd;
    }

    Player.style.left = posX + 'px';
}

let JumpForce = -4
let Gravity = .05;
let Vspd = 0

let TotalJumps = 1
let Jumps = TotalJumps

export function MoveY(_action) {

    if (_action == "Jump") {
        if (Jumps > 0) {
            Vspd = JumpForce
            Jumps -= 1
        }
    };

    const vspdSign = Math.sign(Vspd);
    const hitAtVspd = place_meeting(0, Vspd)

    if (hitAtVspd) {
        if (Vspd > 0) {
            posY = hitAtVspd.Top - PlayerHeight
        } else {
            posY = hitAtVspd.Bottom
        }
        Vspd = 0
    } else {
        const onGround = place_meeting(0, 1);

        if (!onGround) {
            Vspd += Gravity
        } else {
            Jumps = TotalJumps
        }
        posY += Vspd
    }
    Player.style.top = posY + 'px'
}