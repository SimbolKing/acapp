class Fireball extends GameObject {
    constructor(playground, player, x, y, radius, speed_x, speed_y, color, speed) {
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
    }

    start() {

    }

    update() {

    }

    render() {

    }
}