import Awesomplete from 'awesomplete'
import Inventory from '../inventory'
import { obj_map } from '../level_loader'
import { mat_map } from '../texture_lookup'

let editor_options = [];

for(let c of Object.keys(obj_map)) {
    editor_options.push({ label: "object::"+c, value: 'obj::'+c });
}

class EditorInventory extends Inventory {
    constructor() {
        super();

        for(let c of Object.keys(mat_map)) {
            editor_options.push({ label: "material::"+c, value: 'mat::'+c});
        }

        this.slot = 0;
        this.searchbox = null;
        this.player = null;
        this.current = null;
        this.cmats = [];
        this.pad_to_4();
        this.extra = null;
        this.desc = null;
    }

    clear() {
        ///clear out mats
        this.cmats=[];
        this.pad_to_4();
        this.slot=0;
        this.desc=null;
        this.extra=null;
        this.update();_
    }

    pad_to_4() {
        /// the cmats array needs to have 4 things in it alwasy, so
        /// this pads it out with nulls
        if(this.cmats.length > 3) { return; }
        for(let c=this.cmats.length; c<4; c++) {
            this.cmats[c] = null;
        }
    }

    filtered_mats() {
        ///returns this.cmats minus all null materials
        let m = [];
        for(let c of this.cmats) {
            if(c) { m.push(c); }
        }
        return m;
    }

    update() {
        let serial = '';
        serial += '<p>Object: ' + (this.current ? this.current : 'None') + '</p>';
        for(let c = 0; c < 4; c++) {
            serial += '<p>' + (this.slot == c ? '>' : '' ) + `Mat${c+1}:` + (this.cmats[c]) + '</p>';
        }
        serial += '<p>Description: '+this.desc+'</p>';

        this.equipe.innerHTML=serial;
    }

    toggle_slot() {
        this.slot++;
        if(this.slot > 3) { this.slot = 0; }
        this.update();
    }

    description_macro(player) {
        this.player = player;

        let i = document.createElement('input');
        i.id = 'searchbox';
        i.className = 'input-lg';
        i.type = 'text';
        i.placeholder = 'Enter Description';

        let s = document.createElement('span');
        s.className = 'editor-search';
        s.appendChild(i);
        document.body.appendChild(s);
        i.focus();

        this.searchbox = s;

        i.onkeydown = (ent) => {
            if(ent.keyCode == 13) { ///enter
                this.desc = i.value;
                if(this.desc == '') { this.desc = null; }
                this.hide_search();
                this.update();
            }
        }
    }

    search_macro(player) {
        this.player = player;

        let i = document.createElement('input');
        i.id = 'searchbox';
        i.className = 'input-lg';
        i.type = 'text';
        i.placeholder = 'Search for Entites or Materials';
        i.onkeydown = ent => this.searchbox_keydown(ent);
        i.addEventListener('awesomplete-selectcomplete', ent => this.accept_search());

        let s = document.createElement('span');
        s.className = 'editor-search';
        s.appendChild(i);
        document.body.appendChild(s);
        new Awesomplete(i, { list: editor_options, autoFirst: true });
        i.focus();

        this.searchbox = s;
    }

    hide_search() {
        document.body.removeChild(this.searchbox);
        this.searchbox = null;
        if(this.player) {
            this.player.inv_mode = false;
            this.player = null;
        }
    }

    accept_search() {
        let i = document.getElementById('searchbox');
        let res = i.value;

        if(res) {
            let parts = res.split("::");
            if(parts && parts.length == 2) {
                if(parts[0] == 'obj') {
                    ///selected an object class
                    this.current = parts[1];
                } else if(parts[0] == 'mat') {
                    ///selected a material
                    this.cmats[this.slot] = parts[1];
                }
                this.update();
            }
        }

        ///nomatter what, they hit enter - we're done here
        this.hide_search();
    }

    searchbox_keydown(event) {
        ///don't need this?
    }
}

export default EditorInventory;
