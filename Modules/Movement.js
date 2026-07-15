
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
        Right: _KeySizes.right + CurrentScrollX,
    })
    console.log(Collisions)
}
export function remove_colision_data(_key) {
    for (let i = 0; i < Collisions.length; i++) {
        let collidable = Collisions[i];
        if (collidable.value == _key) {
            Collisions.splice(i, 1)
        }
    }
}

//Adicionar colisões iniciais aqui
let BaseFloor = document.getElementById("floor");
add_colision_data(BaseFloor)

//Fim colisões

// function get_player_size() {
//     const rect = Player.getBoundingClientRect();
//     return { width: rect.width, height: rect.height };
// }

function get_side(X, Y) {
    if (X) { if (Math.sign(X) == 1) { return "right" } else { return "left" } }
    if (Y) { if (Math.sign(Y) == 1) { return "down" } else { return "up" } }
    return false
}

// function get_near_collisions(pX, pY) {
//     let newCollisions = Collisions.filter(Colisao =>
//         Colisao.X >= pX - 2 && Colisao.X <= pX + 2
//         &&
//         Colisao.Y >= pY - 2 && Colisao.Y <= pY + 2
//     )
//     if (newCollisions[0] != null) {
//         console.log(newCollisions)
//     }
//     return newCollisions
// }

// let firstFrameVar = true
// let collisionsInQuadrant
// let lastPosX = posX
// let lastPosY = posY

export function place_meeting(offsetX, offsetY) {

    const PlayerHeight = 64
    const PlayerWidth = 64

    const pLeft = posX + offsetX;
    const pRight = posX + PlayerWidth + offsetX;
    const pTop = posY + offsetY;
    const pBottom = posY + PlayerHeight + offsetY;

    let side = get_side(offsetX, offsetY)

    // let pX = Math.floor((posX + (PlayerWidth / 2)) / 128)
    // let pY = Math.floor((posY + (PlayerHeight / 2)) / 128)

    // if (posX >= lastPosX + 32 || posX <= lastPosX - 32 ||
    //     posY >= lastPosY + 32 || posY <= lastPosY - 32 || firstFrameVar == true) {
    //     if (firstFrameVar == true) {
    //         firstFrameVar = false;
    //     }
    //     lastPosX = posX
    //     lastPosY = posY
    //     collisionsInQuadrant = get_near_collisions(pX, pY)
    // }
    for (let i = 0; i < Collisions.length; i++) {
        let collidable = Collisions[i];

        //otimização para checagem inutil
        if (side == false) { return false }

        //verifica se a colisão esta na direção correta
        switch (side) {
            case "right":
                if (pRight >= collidable.Left) {
                    if (pLeft <= collidable.Right && pBottom >= collidable.Top && pTop <= collidable.Bottom) {
                        return collidable
                    }
                    continue
                }
                break
            case "left":
                if (pLeft <= collidable.Right) {
                    if (pRight >= collidable.Left && pBottom >= collidable.Top && pTop <= collidable.Bottom) {
                        return collidable
                    }
                    continue
                }
                break
            case "down":
                if (pBottom >= collidable.Top) {
                    if (pRight >= collidable.Left && pLeft <= collidable.Right && pTop <= collidable.Bottom) {
                        return collidable
                    }
                    continue
                }
                break
            case "up":
                if (pTop <= collidable.Bottom) {
                    if (pRight >= collidable.Left && pLeft <= collidable.Right && pBottom >= collidable.Top) {
                        return collidable
                    }
                    continue
                }
                break
        }
    }
    return null;
}

let Hspd = 0
let Speed = 4

// common player movement

// movement do player na direção X
export function MoveX(_Left, _Right) {
    let Xdir = -_Left + _Right;
    Hspd = Xdir * Speed;
    let HspdSign = Math.sign(Hspd)

    let hitX = place_meeting(Hspd, 0)
    if (hitX) {
        if (HspdSign > 0) {
            posX = hitX.Left - 65
        } else if (HspdSign < 0) {
            posX = hitX.Right + 1
        }
        Hspd = 0
    }
    posX += Hspd;
    Player.style.left = posX + 'px';
}

let JumpForce = -4
let Gravity = .05;
let Vspd = 0

let TotalJumps = 2
let Jumps = TotalJumps

export function MoveY(_action) {

    if (_action == "Jump") {
        if (Jumps > 0) {
            Vspd = JumpForce
            Jumps -= 1

            posY += Vspd
            Player.style.top = posY + 'px'
        }
    };



    let VspdSign = Math.sign(Vspd)
    let hitY = place_meeting(0, Vspd)

    if (hitY) {
        if (VspdSign > 0) {
            posY = hitY.Top - 65
        } else {
            posY = hitY.Bottom + 1
        }
        Vspd = 0
    }
    if (!place_meeting(0, 1)) {
        Vspd += Gravity
    } else {
        Jumps = TotalJumps
    }

    posY += Vspd
    Player.style.top = posY + 'px'
}