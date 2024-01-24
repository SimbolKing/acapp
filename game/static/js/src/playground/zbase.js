class Playground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div>Game page</div>
        `);

        this.hide();
        this.root.$game.append(this.$playground);

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
}