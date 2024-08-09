class AcGame {
    // AcWingOS：在AcWing上执行
    constructor(id, AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.AcWingOS = AcWingOS;

        this.start();
    }

    start() {

    }
}
