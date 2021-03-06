export let rev_map = {};

export function init_serializer(map) {
    for(let e of Object.keys(map)) {
        rev_map[map[e].name] = e;
    }
}

class LevelSerializer {
    constructor(grid) {
        this.grid = grid;
    }

    serialize(obj) {
        let serial = {
            type: rev_map[obj.constructor.name],
            mats: obj._mats,
            desc: obj.desc,
            extra: obj.extra
        };
        if(obj['object']) {
            let object = {
                type: rev_map[obj.object.constructor.name],
                mats: obj.object._mats,
                desc: obj.object.desc,
                extra: obj.object.extra
            };

            if(!object['desc']) { delete object['desc']; }
            if(!object['extra']) { delete object['extra']; }

            serial['extra'] = { object: object };
        }
        if(!serial['desc']) { delete serial['desc']; }
        if(!serial['extra']) { delete serial['extra']; }

        return serial;
    }

    serialize_level() {
        let serial = [];
        for(let x = 0; x < this.grid.grid.length; x++ ) {
            let cglen = this.grid.grid[x] ? this.grid.grid[x].length : 0;
            for(let z = 0; z < cglen; z++) {
                if(!this.grid.grid[x][z]) { continue; }
                if(!serial[z]) { serial[z] = []; }
                serial[z][x] = this.serialize(this.grid.grid[x][z]);
            }
        }

        return serial;
    }
}

export default LevelSerializer;
