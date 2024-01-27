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
