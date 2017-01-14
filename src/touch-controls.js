const key_left = 37;
const key_right = 39;
const key_up = 38;
const key_down = 40;
const key_space = 32;

class TouchControls {
    constructor(parent_id) {
        this.parent_div = document.getElementById(parent_id);

        let left_button = document.createElement('div');
        left_button.className='touch-button';
        left_button.onclick = ent => this.simkey(key_left, ent);
        left_button.innerHTML = '<==';

        let right_button = document.createElement('div');
        right_button.className='touch-button';
        right_button.onclick = ent => this.simkey(key_right, ent);
        right_button.innerHTML = '==>';

        let up_button = document.createElement('div');
        up_button.className='touch-button';
        up_button.onclick = ent => this.simkey(key_up, ent);
        up_button.innerHTML = ' ^ ';

        let down_button = document.createElement('div');
        down_button.className='touch-button';
        down_button.onclick = ent => this.simkey(key_down, ent);
        down_button.innerHTML = ' V ';

        let space_button = document.createElement('div');
        space_button.className='touch-button';
        space_button.onclick = ent => this.simkey(key_space, ent);
        space_button.innerHTML = '[   ]';

        this.parent_div.appendChild(left_button);
        this.parent_div.appendChild(up_button);
        this.parent_div.appendChild(right_button);
        this.parent_div.appendChild(down_button);
        this.parent_div.appendChild(space_button);
    }

    simkey(keycode, event) {
        let ent = document.createEvent("KeyboardEvent");
        const initMethod = typeof ent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

        ent[initMethod]("keydown", true, true, window, false, false, false, false, keycode, 0);
        document.dispatchEvent(ent);
    }
}

export default TouchControls;
