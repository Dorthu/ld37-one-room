/*
    Editor TODOs:
*/
import Player from '../player'
import { obj_map } from '../level_loader'
import LevelSerializer,  { rev_map } from './level_serializer'
import SpriteObject from '../sprite_object'
import PerciseEditor from './percise_editor'
import { store_set, store_get } from '../persistence_manager'

import { THREE } from '../Three'
import assign from 'object-assign'

const edirs = [ { x: 1, z: 0 }, { x: 0, z: 1 }, { x: -1, z: 0 }, { x: 0, z: -1 } ];
const command_keys = [ '1','2','3','4','5','6','7','8','9','0','F','W','R','X' ];
let command_keycodes = [];
for(let k of command_keys) {
    command_keycodes.push(k.charCodeAt(0));
}

class EditorPlayer extends Player {

    constructor(grid, loc, inventory, facing=0) {
        super(grid, loc, inventory, facing);

        this.command = [];

        ///the EditorPlayer class manages the editor gridlines because I don't think that
        ///that alone warrants making an EditorGrid class
        this.visual_grid = new THREE.GridHelper(6*50, 6);
        let vgp = { x: 49.5, z: 49.5, y: -.5 };
        vgp = this.grid.translate(vgp);
        this.visual_grid.position.set(vgp.x, vgp.y, vgp.z);
        this.grid.scene.add(this.visual_grid);
    }

    get(object=true) {
        this.inventory.extra = null; ///clear out extra
        let target = this._point_in_front();
        let o = this.grid.get(target.x, target.z);
        if(o) {
            if(object && o['object']) { o = o.object; }
            //this.inventory.current = o.constructor.name.toLowerCase();
            this.inventory.current = rev_map[o.constructor.name];
            this.inventory.cmats = o._mats;
            this.inventory.pad_to_4();
            //this.inventory.cmat1 = o._mats[0];
            //this.inventory.cmat2 = ( o._mats.lenght > 1 ? o._mats[1] : null );
            if(object && o.extra) { this.inventory.extra = o.extra; }
            this.inventory.update();
        }
    }

    do_command(command) {
        if(this.command.length) {
            switch(this.command[0]){
                case 'F':
                    let node = this._point_in_front();
                    let o = this.grid.get(node.x, node.z);
                    if(o) {
                        this.flood_fill(node, o.constructor.name, o._mats[0]);
                    }
                    break;
                case 'W':
                    this.wall_fill();
                    break;
                case 'R':
                    if(this.command.indexOf('X')!=-1) {
                        this.make_room();
                    }
                    break;
                default:
                    let amount = 1;
                    if(this.command.length) {
                        amount = Number.parseInt(this.command.join(''));
                    }
                    let lead = this._point_in_front();
                    let dir = { x: lead.x - this.loc.x, z: lead.z - this.loc.z };
                    for(let mag=1; mag<=amount; mag++) {
                       command({x: this.loc.x + dir.x * mag, y: 0, z: this.loc.z + dir.z * mag });
                    }
                    break;
            }
        }
        else {
            let target = this._point_in_front();
            command({ x: target.x, y: 0, z: target.z });
        }
        this.command = [];
    }

    flood_fill(node, target_obj, target_color) {
        let o = this.grid.get(node.x, node.z);
        if(!o || o.constructor.name != target_obj
            || o._mats[0] == this.inventory.cmats[0]
            || o._mats[0] != target_color) {
                return;
        }

        this.make(node);
        for(let d of edirs) {
            this.flood_fill({ x: node.x + d.x, z: node.z + d.z }, target_obj, target_color);
        }
    }

    wall_fill() {
        /*
            This runs as a flood fill, but fills all empty edge spaces.
        */
        let visited = [];
        let self = this;

        function outline(target, target_obj, target_mat) {
            if(visited.indexOf(target.x+";"+target.z) != -1) { return; }
            visited.push(target.x+";"+target.z);
            let o = self.grid.get(target.x, target.z);

            if(!o) {
                self.make(target);
                return;
            }

            if(o.constructor.name != target_obj || o._mats[0] != target_mat
                    || o._mats[0] == self.inventory.cmats[0]) {
                return;
            }

            for(let d of edirs) {
                outline({ x: target.x + d.x, z: target.z + d.z }, target_obj, target_mat);
            }
        }

        let target = this._point_in_front();
        let to = this.grid.get(target.x, target.z);

        if(to) {
            outline(target, to.constructor.name, to._mats[0]);
        }

    }

    make_room() {
        this.command = this.command.splice(1);
        let [len, wid] = this.command.join('').split('X');
        if(!len || !wid) {
            return;
        }
        len = Number.parseInt(len);
        wid = Number.parseInt(wid);
        //align with the player's facing
        if(this.facing % 2) { [ len, wid ] = [ wid, len ]; }

        let pos = this._point_in_front();

        if(this.facing == 0) {
            pos.x += Math.floor(wid/2);
            pos.z -= len - 1;
        }
        else if(this.facing == 1) {
            pos.x -= wid - 1;
            pos.z += Math.floor(wid/2);
        } else {
            pos.x += Math.floor(wid/2) * edirs[this.facing].x;
            pos.z += Math.floor(wid/2) * edirs[this.facing].z;
        }


        for(let c = pos.x; c<pos.x+wid; c++) {
            for(let d = pos.z; d<pos.z+len; d++) {
                this.make({x: c, z: d});
            }
        }
    }

    make(target) {
        let ci = this.inventory.current;
        if(!ci) { console.log('no tiles selected'); return; }
        let mats = this.inventory.filtered_mats(); ///don't leave trailing null mats
        if(obj_map[ci] && obj_map[ci].occupies()) {
            let c = this.grid.get(target.x, target.z);
            if(c) {
                c.object = c.make_object(ci, mats, null, this.inventory.extra);
            }
        } else {
            let o = this.grid.create(obj_map[ci],
               target, mats, null);
        }
    }

    remove(target) {
        this.grid.remove(target.x, target.z);
    }

    toggle_bit(bit) {
        let target = this._point_in_front();
        let o = this.grid.get(target.x, target.z);
        if(o) {
            let obj = o["object"];
            if(obj) {
                if(obj[bit]) { obj[bit] = !obj[bit] }
                else { obj[bit] = true; }
            }
        }
    }

    percise_editor() {
        /*
         This turns on the percise mode for tweaking specific aspects of
         the object in front of you.  This prevents movement until q is pressed.
        */
        this.inv_mode=true;

        let target = this._point_in_front();
        let o = this.grid.get(target.x, target.z);

        if(!o) { this.inv_mode = false; return; }

        o = o.object;
        if(!o) { this.inv_mode = false; return; }

        new PerciseEditor(this, o);
    }

    serialize_to_user() {
        let serial = new LevelSerializer(this.grid).serialize_level();

        let e = document.createElement("div");
        e.innerHTML = "<pre>" +JSON.stringify(serial)+"</pre>";
        document.body.appendChild(e);
    }

    _save_level() {
        const serial = new LevelSerializer(this.grid).serialize_level();
        const serial_str = JSON.stringify(serial);

        store_set('level_bkp', serial_str);
    }

    input(event) {
        if(this.inv_mode) {
            if(event.keyCode == 27) {
                this.inv_mode = false;
                this.inventory.hide_search();
            }
            return;
        }
        let prevent_save = false;

        if(command_keycodes.includes(event.keyCode)) {
            this.command.push(String.fromCharCode(event.keyCode));
        }else if(event.keyCode == 32) {
            this.do_command(e => this.make(e));
        } else if(event.keyCode == 68) { ///d
            this.do_command(e => this.remove(e));
        } else if(event.keyCode == 75) { ///k
            this.percise_editor();
        } else if(event.keyCode == 84) {
            this.toggle_bit('solid');
        } else if(event.keyCode == 83) { ///s
            this.serialize_to_user();
        } else if(event.keyCode == 67) { ///c
            this.inventory.clear();
            prevent_save = true;
        } else if(event.keyCode == 81) {
            this.inventory.toggle_slot();
            prevent_save = true;
        } else if(event.keyCode == 71) { ///g
            this.get();
            prevent_save = true;
        } else if(event.keyCode == 72) { ///h
            this.get(false); ///this is get the space always
            prevent_save = true;
        } else if(event.keyCode == 76) { ///l
            let level = prompt('Level URL:');
            const e = { detail: { data: { to: level, player_pos: this.loc } } };

            this.grid.transition(e);
            prevent_save = true;
        } else if(event.keyCode == 186) { ///;
            this.visual_grid.visible = !this.visual_grid.visible;
        } else if(event.keyCode == 27) {
            this.command = [];
        } else if(event.keyCode == 69) { ///e
            event.preventDefault();
            this.inv_mode = true;
            this.inventory.search_macro(this);
            prevent_save = true;
        } else if(event.keyCode == 187) { ///=
            const json_string = store_get('level_bkp');
            const json = JSON.parse(json_string);
            const e = { detail: { data: { to: json, player_pos: this.loc } } }; /// fake event for loading

            this.grid.transition(e); /// event 
            prevent_save = true;
        } else {
            prevent_save = true;
            super.input(event);
        }

        if(!prevent_save) this._save_level();
    }
}

export default EditorPlayer;
