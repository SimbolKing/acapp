let GAME_OBJECTS = [];

class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);
        this.has_called_start = false;
        this.timedelta = 0; // 距离上一帧的时间间隔 ms
    }

    start() {

    }

    update() {

    }

    before_destroy() {

    }

    destroy() {
        this.before_destroy();

        for (let obj in GAME_OBJECTS) {
            if (GAME_OBJECTS[obj] === this) {
                GAME_OBJECTS[i].splice();
                break;
            }
        }
    }
}

let last_timestamp;
let Game_Animation = (timestamp) => {
    for (let obj of GAME_OBJECTS) {
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;

    requestAnimationFrame(Game_Animation);
}

requestAnimationFrame(Game_Animation);