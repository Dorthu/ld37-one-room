export default class PerciseEditor {
    constructor(player, target) {
        this.player = player;
        this.target = target;

        this.extra = target.extra;
        if(!this.extra['offset-x']) this.extra['offset-x'] = 0;
        if(!this.extra['offset-y']) this.extra['offset-y'] = 0;
        if(!this.extra['offset-z']) this.extra['offset-z'] = 0;

        console.log(this.target);

        this.listener = ent => this.input(ent)
        document.addEventListener('keydown', this.listener);
    }

    _update() {
        this.target.extra = this.extra;
        this.target.update_meshes();
        this.target._fine_tune(); /// _fine_tune is a relative update :\
    }

    destroy() {
        document.removeEventListener(this.listener);
    }

    input(event) {
        if(event.keyCode == 27) { /// escape
            this.destroy();
            return;
        }

        if(event.keyCode == 38) { /// up arrow
            this.extra['offset-x'] += .2;
            this._update();
        } else if(event.keyCode == 40) { /// down arrow
            this.extra['offset-x'] -= .2;
            this._update();
        } else if(event.keyCode == 37) { /// left arrow
            this.extra['offset-z'] += .2;
            this._update();
        } else if(event.keyCode == 39) { /// right arrow
            this.extra['offset-z'] -= .2;
            this._update();
        }
    }
}
