class AcGameMenu {
    constructor(root) {
        this.root = root;

        // 渲染menu界面
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings-mode">
            设置
        </div>
    </div>
</div>
        `);

        // 添加menu到主页面
        this.root.$ac_game.append(this.$menu);

        // 显示3个按钮
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings-mode');

        // 初始化
        this.start();
    }

    start() {
        this.add_listening_events();
    }

    // 监听函数
    add_listening_events() {
        // 获取函数外的this
        let outer = this;

        this.$single_mode.click(function () {
            outer.hide(); // 关闭menu
            outer.root.playground.show(); // 展示playground
        });

        this.$multi_mode.click(function () {
            console.log('multi');
        });

        this.$settings.click(function () {
            console.log('settings');
        });
    }

    // 打开menu
    show() {
        this.$menu.show();
    }

    // 关闭menu
    hide() {
        this.$menu.hide();
    }

}