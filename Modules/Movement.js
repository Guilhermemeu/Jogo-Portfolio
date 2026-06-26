let posX = 950;
let posY = 0;

let Player = document.getElementById("player")

let Collisions = {}

export function get_collisions() {
    return Collisions;
}

export function add_colision_data(_Key) {
    if (_Key === null) {
        alert("_Key não encontrada")
        return
    }
    

    let _KeySizes = _Key.getBoundingClientRect()

    let CurrentScrollX = window.scrollX
    let CurrentScrollY = window.scrollY


    Collisions[_Key.id] = {
        Top: _KeySizes.top + CurrentScrollY,
        Bottom: _KeySizes.bottom + CurrentScrollY,
        Left: _KeySizes.left + CurrentScrollX,
        Right: _KeySizes.right + CurrentScrollX
    }
    console.log(Collisions)
}

let BaseFloor = document.getElementById("floor");
add_colision_data(BaseFloor)

export function place_meeting(offsetX, offsetY) {
    const pw = Player.offsetWidth;
    const ph = Player.offsetHeight;

    const p = {
        left: posX + offsetX,
        right: posX + pw + offsetX,
        top: posY + offsetY,
        bottom: posY + ph + offsetY,
    };

    for (const key in Collisions) {
        if (Object.prototype.hasOwnProperty.call(Collisions, key)) {
            const Value = Collisions[key];

            if (
                p.bottom <= Value.Top ||
                p.top >= Value.Bottom ||
                p.right <= Value.Left ||
                p.left >= Value.Right
            ) {
                continue
            }
            return true
        }
    };
    return false

}
let Hspd = 0
let Speed = 4

// common player movement
export function MoveX(_Left, _Right) {
    let Xdir = -_Left + _Right;
    Hspd = Xdir * Speed;

    if (place_meeting(Hspd, 0)) {
        while (Math.abs(Hspd) && !place_meeting(Math.sign(Hspd), 0)) {
            posX += Math.sign(Hspd);
        }

        Hspd = 0
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

    if (place_meeting(0, Vspd)) {
        while (!place_meeting(0, Math.sign(Vspd))) {
            posY += Math.sign(Vspd);
            Player.style.top = posY + 'px';
        }
        Vspd = 0
    } else {

        if (!place_meeting(0, 1)) {
            Vspd += Gravity
        } else {
            Jumps = TotalJumps
        }
        posY += Vspd
    }
    Player.style.top = posY + 'px'
}