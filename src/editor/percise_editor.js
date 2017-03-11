import { rev_map } from './level_serializer'

export default class PerciseEditor {
    constructor(player, target) {
        this.player = player;
        this.target = target;
        this.focus_box = null; ///modal for input
        this.ui_parent = document.getElementById("equipped"); /// we steal UI from the inventory
        this.target_name =  rev_map[this.target.constructor.name];

        this.extra = target.extra;
        if(!this.extra) this.extra = {};
        if(!this.extra['offset-x']) this.extra['offset-x'] = 0;
        if(!this.extra['offset-y']) this.extra['offset-y'] = 0;
        if(!this.extra['offset-z']) this.extra['offset-z'] = 0;
        if(!this.extra['rot']) this.extra['rot'] = 0;

        this.listener = ent => this.input(ent)
        document.addEventListener('keydown', this.listener);

        this.do_ui();
    }

    do_ui() {
        let serial = '';

        serial += '<h4>Editing ' + this.target_name + '</h4>';
        serial += '<p><em>Desc:</em> ' + this.target.desc + '</p>';
        serial += '<p><em>Extra:</em></p><pre>' + JSON.stringify(this.target.extra, null, 2) + '</pre>';

        this.ui_parent.innerHTML = serial;
    }

    _update() {
        this.target.extra = this.extra;
        this.target.update_meshes();
        this.target._fine_tune();

        this.do_ui();
    }

    destroy() {
        document.removeEventListener('keydown', this.listener);
        this.player.inventory.update();
    }

    description_macro() {
        this.show_focus_box( v => {
            this.target.desc = v;
            if(this.target.desc == '') this.target.desc = null;
        }, 'Enter Description', this.target.desc);
    }

    set_value_for_key() {
        this.show_focus_box( v => {
            if(v.indexOf(':') == -1) { return; }

            let [ key, value ] = v.split(':');
            this.extra[key.trim()] = value.trim();
            this._update();
        }, 'key: value', null);
    }

    show_focus_box(callback, placeholder, initial_value) {
        let i = document.createElement('input');
        i.id = 'searchbox';
        i.className = 'input-lg';
        i.type = 'text';
        i.placeholder = placeholder;
        i.value = initial_value ? initial_value : null;

        let s = document.createElement('span');
        s.className = 'editor-search';
        s.appendChild(i);
        document.body.appendChild(s);
        i.focus();

        this.focus_box = s;

        i.onkeydown = (ent) => {
            if(ent.keyCode == 13) { ///enter
                callback(i.value);
                this.hide_focus_box();
            }
        }
    }

    hide_focus_box() {
        if(!this.focus_box) { return; }

        document.body.removeChild(this.focus_box);
        this.focus_box = null;
        this.player.inv_mode = true;
        this.do_ui();
    }

    input(event) {
        if(event.keyCode == 27) { /// escape
            if(this.focus_box) { this.hide_focus_box(); }
            else { this.destroy(); }
            return;
        }

        if(this.focus_box) { return; } /// let input go to the textbox

        /// pressing shift quadruples speed
        const shift_mod = event.shiftKey ? 4 : 1;

        if(event.keyCode == 38) { /// up arrow
            this.extra['offset-x'] += .1 * shift_mod;
            this._update();
        } else if(event.keyCode == 40) { /// down arrow
            this.extra['offset-x'] -= .1 * shift_mod;
            this._update();
        } else if(event.keyCode == 37) { /// left arrow
            this.extra['offset-z'] += .1 * shift_mod;
            this._update();
        } else if(event.keyCode == 39) { /// right arrow
            this.extra['offset-z'] -= .1 * shift_mod;
            this._update();
        } else if(event.keyCode == 188) { /// <
            this.extra['rot'] -= 4 * Math.PI/360 * shift_mod;
            this._update();
        } else if(event.keyCode == 190) { /// >
            this.extra['rot'] += 4 * Math.PI/360 * shift_mod;
            this._update();
        } else if(event.keyCode == 68) { /// d
            event.preventDefault();
            this.description_macro();
        } else if(event.keyCode == 69) { /// e
            event.preventDefault();
            this.set_value_for_key();
        }
    }
}
