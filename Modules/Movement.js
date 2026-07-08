
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

function getPlayerSize() {
    const rect = Player.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

function get_side(X, Y) {
    if (X) { if (Math.sign(X) == 1) { return "right" } else { return "left" } }
    if (Y) { if (Math.sign(Y) == 1) { return "down" } else { return "up" } }
    return false
}

export function place_meeting(offsetX, offsetY) {

    const { width: PlayerWidth, height: PlayerHeight } = getPlayerSize()

    const pLeft = posX + offsetX;
    const pRight = posX + PlayerWidth + offsetX;
    const pTop = posY + offsetY;
    const pBottom = posY + PlayerHeight + offsetY;

    let side = get_side(offsetX, offsetY)

    for (let i = 0; i < Collisions.length; i++) {
        let collidable = Collisions[i];

        //otimização para checagem inutil
        if (side == false) { return false }
        console.log(side)

        //verifica se a colisão esta na direção correta
        switch (side) {
            case "right":
                if (pRight >= collidable.Left && collidable.Left <= posX + 64) {
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

    if (place_meeting(Hspd, 0)) {
        while (!place_meeting(HspdSign, 0)) {
            posX += HspdSign;
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

    if (place_meeting(0, Vspd)) {
        while (!place_meeting(0, VspdSign)) {
            posY += VspdSign;
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