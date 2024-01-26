class GameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="game-menu">
                <div class="game-menu-item">
                    <div class="game-menu-item-button singleplayer">
                        单人模式
                    </div>
                    <div class="game-menu-item-button multiplayer">
                        多人模式
                    </div>
                    <div class="game-menu-item-button settings">
                        设置
                    </div>
            </div>
        `);
        this.root.$game.append(this.$menu);

        this.$singleplayer = this.$menu.find('.singleplayer');
        this.$multiplayer = this.$menu.find('.multiplayer');
        this.$settings = this.$menu.find('.settings')

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$singleplayer.click(() => {
            outer.hide();
            outer.root.playground.show();
        });
        this.$multiplayer.click(() => {
            console.log('multi');
        });
        this.$settings.click(() => {
            console.log('settings');
        });
    }

    update() {

    }

    destroy() {

    }

    hide() {
        this.$menu.hide();
    }

    show() {
        this.$menu.show();
    }
}
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

        for (let i in GAME_OBJECTS) {
            if (GAME_OBJECTS[i] === this) {
                GAME_OBJECTS.splice(i, 1);
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

requestAnimationFrame(Game_Animation);class GameMap extends GameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class Player extends GameObject {
    constructor(playground, x, y, radius, color, speed, is_me) {
        super();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;

        this.attacked_x = 0;
        this.attacked_y = 0;
        this.attacked_speed = 0;
        this.attacked_friction = 0.9;

        this.speed = speed;
        this.speed_x = 0;
        this.speed_y = 0;
        this.move_length = 0;

        this.is_me = is_me;
        this.playground = playground;

        this.ctx = this.playground.game_map.ctx;
        this.eps = 0.1; // <0.1 = 0

        this.cur_skill = null;
    }

    start() {
        if (this.is_me) {
            this.add_listening_events();
        } else {
            let bot_tx = Math.random() * this.playground.width;
            let bot_ty = Math.random() * this.playground.height;
            this.move_to(bot_tx, bot_ty);
        }
    }

    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (e.which === 3) {
                outer.move_to(e.clientX, e.clientY);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball(e.clientX, e.clientY);
                }

                outer.cur_skill = null;
            }
        });

        $(window).keydown(function (e) {
            if (e.which === 81) { // Q
                outer.cur_skill = "fireball";

                return false;
            }
        });
    }

    shoot_fireball(tx, ty) {
        let x = this.x, y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(ty - this.y, tx - this.x);
        let speed_x = Math.cos(angle), speed_y = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        new Fireball(this.playground, this, x, y, radius, speed_x, speed_y, color, speed, move_length, this.playground.height * 0.01);
    }

    get_dist(x1, x2, y1, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move_to(tx, ty) {
        this.move_length = this.get_dist(this.x, tx, this.y, ty);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.speed_x = Math.cos(angle);
        this.speed_y = Math.sin(angle);
    }

    is_attacked(angle, damage) {
        this.radius -= damage;
        if (this.radius < 10) {
            this.destroy();
            return false;
        }
        this.attacked_x = Math.cos(angle);
        this.attacked_y = Math.sin(angle);
        this.attacked_speed = damage * 100;
        this.speed *= 1.35;
    }

    update() {
        if (this.attacked_speed > 10) {
            this.speed_x = this.speed_y = 0;
            this.move_length = 0;
            this.x += this.attacked_x * this.attacked_speed * this.timedelta / 1000;
            this.y += this.attacked_y * this.attacked_speed * this.timedelta / 1000;
            this.attacked_speed *= this.attacked_friction;
        } else if (this.move_length < this.eps) {
            this.move_length = 0;
            this.speed_x = this.speed_y = 0;
            if (!this.is_me) {
                let bot_tx = Math.random() * this.playground.width;
                let bot_ty = Math.random() * this.playground.height;
                this.move_to(bot_tx, bot_ty);
            }
        } else {
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.speed_x * moved;
            this.y += this.speed_y * moved;
            this.move_length -= moved;
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Fireball extends GameObject {
    constructor(playground, player, x, y, radius, speed_x, speed_y, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.speed_x = speed_x;
        this.speed_y = speed_y;
        this.speed = speed;
        this.radius = radius;
        this.color = color;
        this.move_length = move_length;
        this.damage = damage;
        this.eps = 0.1;
    }

    start() {

    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();

            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.speed_x * moved;
        this.y += this.speed_y * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        return distance < this.radius + player.radius;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        this.destroy();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Playground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`<div class="playground"></div>`);

        // this.hide();
        this.root.$game.append(this.$playground);

        this.width = this.$playground.width();
        this.height = this.$playground.height();

        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true))

        for (let i = 0; i < 5; i ++ ) {
             this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "blue", this.height * 0.15, false))
        }

        this.start();
    }

    start() {

    }

    update() {

    }

    show() {
        this.$playground.show();
    }

    hide() {
        this.$playground.hide();
    }
}export class Game {
    constructor(id) {
        this.id = id;
        this.$game = $('#' + id);

        // this.menu = new GameMenu(this);
        this.playground = new Playground(this);

        this.start();
    }

    start() {

    }
}