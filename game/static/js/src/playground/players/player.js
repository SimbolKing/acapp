class Player extends GameObject {
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
        this.react_time = 0;

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
            // 更改BUG：死亡后仍然可以攻击
            if (outer.radius < 10) return;

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

        for (let i = 0; i < 20 + Math.random() * 10; i ++ ) {
            let x = this.x, y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.PI * 2 * Math.random();
            let speed_x = Math.cos(angle), speed_y = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, speed_x, speed_y, color, speed, move_length);
        }
    }

    update() {
        this.react_time += this.timedelta / 1000;
        if (!this.is_me && this.react_time > 4 && Math.random() < 1 / 300.0) {
            let player = this.playground.players[0];
            let tx = player.x + player.speed * this.speed_x * this.timedelta / 1000 * 0.3;
            let ty = player.y + player.speed * this.speed_y * this.timedelta / 1000 * 0.3;

            this.shoot_fireball(tx, ty);
        }

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

    before_destroy() {
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }
}