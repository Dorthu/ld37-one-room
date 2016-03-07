import Player from '../player'
import { obj_map } from '../level_loader'
import LevelSerializer from './level_serializer'

class EditorPlayer extends Player {

    make() {
        let target = this._point_in_front();
        let ci = this.inventory.equipped['tile'];
        if(!ci) { console.log('no tiles selected'); return; }
        let mats = [ this.inventory.equipped['mat_1'].name,
            this.inventory.equipped['mat_2'] ? this.inventory.equipped['mat_2'].name : null ];
        let o = this.grid.create(obj_map[ci.name], 
           target, mats, 'editor created this');
    }

    remove() { 
        let target = this._point_in_front();
        this.grid.remove(target.x, target.z);
    }

    input(event) {
        if(event.keyCode == 85) {
            this.make();
        } else if(event.keyCode == 68) {
            this.remove();
        } else if(event.keyCode == 83) {
            new LevelSerializer(this.grid).serialize_level();
        } else {
            super.input(event);
        }
    }
}

export default EditorPlayer;
