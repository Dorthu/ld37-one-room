const key_left = 37;
const key_right = 39;
const key_up = 38;
const key_down = 40;
const key_space = 32;

class TouchControls {
    constructor(parent_id) {
        this.parent_div = document.getElementById(parent_id);

        let left_button = document.createElement('div');
        left_button.id = 'touch-left';
        left_button.className='touch-button';
        left_button.onclick = ent => this.simkey(key_left, ent);
        left_button.innerHTML = '<span class="glyphicon glyphicon-triangle-left" aria-hidden="true"></span>';

        let right_button = document.createElement('div');
        right_button.id = 'touch-right';
        right_button.className='touch-button';
        right_button.onclick = ent => this.simkey(key_right, ent);
        right_button.innerHTML = '<span class="glyphicon glyphicon-triangle-right" aria-hidden="true"></span>';

        let up_button = document.createElement('div');
        up_button.id = 'touch-up';
        up_button.className='touch-button';
        up_button.onclick = ent => this.simkey(key_up, ent);
        up_button.innerHTML = '<span class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>';

        let down_button = document.createElement('div');
        down_button.id = 'touch-down';
        down_button.className='touch-button';
        down_button.onclick = ent => this.simkey(key_down, ent);
        down_button.innerHTML = '<span class="glyphicon glyphicon-triangle-bottom" aria-hidden="true"></span>';

        let space_button = document.createElement('div');
        space_button.id='touch-space';
        space_button.className='touch-button';
        space_button.onclick = ent => this.simkey(key_space, ent);
        space_button.innerHTML = '<span class="glyphicon glyphicon-modal-window" aria-hidden="true"></span>';

        let mid_div = document.createElement('div');
        mid_div.className='float-left';
        mid_div.appendChild(up_button);
        mid_div.appendChild(down_button);

        this.parent_div.appendChild(left_button);
        this.parent_div.appendChild(mid_div);
        this.parent_div.appendChild(right_button);
        this.parent_div.appendChild(space_button);
    }

    simkey(keycode, event) {
        let ent = document.createEvent("KeyboardEvent");
        const initMethod = typeof ent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

        // Chromium Hack
        Object.defineProperty(ent, 'keyCode', {
                    get : function() {
                        return this.keyCodeVal;
                    }
        });
        Object.defineProperty(ent, 'which', {
                    get : function() {
                        return this.keyCodeVal;
                    }
        });


        ent[initMethod]("keydown", true, true, window, false, false, false, false, keycode, 0);
        ent.keyCodeVal = keycode;
        document.dispatchEvent(ent);
    }
}

export default TouchControls;
