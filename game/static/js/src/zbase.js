class Game {
    constructor(id) {
        this.id = id;
        this.$game = $('#' + id);

        this.menu = new GameMenu(this);
        this.playground = new Playground(this);

        this.start();
    }

    start() {

    }
}