import { THREE, geo } from './Three'

import Grid from './grid'
import Wall from './wall'
import Space from './space'
import Door from './door'
import Pickup from './pickup'
import SolidItem from './solid_item'
import NPC from './game/npc'
import AI from './game/ai'
import TallSprite from './tall_sprite'
import LockedDoor from './locked_door'
import FlatObject from './fobj'
import TallWall from './tall_wall'
import AmmoPickup from './game/ammo_pickup'
import TallDoor from './tall_door'
import Level from './game/level'
import ConditionalPickup from './game/conditional_pickup'
import ConditionalLockedDoor from './game/conditional_locked_door'
import EventSpace from './game/event_space'
import Switch from './switch'
import LosTrigger from './game/los_trigger'
import DropSpace from './game/drop_space'
import CubeWall from './game/cube_wall'
import SpriteObject from './sprite_object'
import DoubleCubeWall from './game/double_cube_wall'
import ConditionalEventPickup from './game/conditional_event_pickup'
import DropWall from './game/drop_wall'

export const obj_map = {
    'space':    Space,
    'wall':     Wall,
    'enclosed': Space,
    'door': Door,
    'pickup': Pickup,
    'solid': SolidItem,
    'npc': NPC,
    'ai': AI,
    'tall': TallSprite,
    'locked': LockedDoor,
    'fobj': FlatObject,
    'twall': TallWall,
    'ammo': AmmoPickup,
    'tdoor': TallDoor,
    'cpickup': ConditionalPickup,
    'clocked': ConditionalLockedDoor,
    'espace': EventSpace,
    'switch': Switch,
    'lostrigger': LosTrigger,
    'dropspace': DropSpace,
    'cube_wall': CubeWall,
    'double_cube_wall': DoubleCubeWall,
    'sprite': SpriteObject,
    'cepickup': ConditionalEventPickup,
    'dwall': DropWall,
}

///why is this a class?
class LevelLoader {
    constructor() {
        this.level_json = {};
    }

    _get_level(uri) {
        if(!this.level_json[uri]) {
            let req = new XMLHttpRequest();
            req.open('GET', uri+'.json', false); ///run this synchronously
            req.send(null);

            if(!req.status == 200) { return {}; } ///bad things
            this.level_json[uri] = JSON.parse(req.responseText);
        }
        return this.level_json[uri];
    }

    load_level(uri) {
        let all_data = typeof(uri) === 'object' ? uri :  this._get_level(uri);

        let data = all_data;
        if(data.constructor != Array && all_data['level']) {
            data['level-uri'] = uri;
            data = all_data.level;
        }

        let grid = new Grid();
        /// we need this while loading up objects to check
        /// conditionals
        if(all_data !== data) {
            grid.level = new Level(grid, all_data);
        }

        for(let i=0; i<data.length; i++) {
            let curr = data[i];
            for(let j=0; j<curr.length; j++) {
                let cur = curr[j];
                if(cur) {
                    grid.create(obj_map[cur.type], { x: j, y: 0, z: i }, cur.mats, cur.desc, cur.extra);
                }
            }
        }

        for(let a of grid.post_load_actions) {
            a();
        }

        return grid;
    }
}

export default LevelLoader;
