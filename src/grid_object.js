import assign from 'object-assign'
import { obj_map } from './level_loader'

class GridObject {
    constructor(grid, loc, mats, desc, extra) {
        this.grid = grid;
        this.loc = loc;
        this.desc = desc;
        this.extra = extra;
        this.solid = false;
        this.usable = false;
        this.meshes = [];
        this._mats = mats;
        this.object = null;

        if(extra && extra['object']) {
            this.object = this.make_object(this.extra.object.type,
                    extra.object['mats'], extra.object['desc'], extra.object['extra']);
        }
    }

    make_object(cname, mats, desc, extra) {
        return new obj_map[cname](this.grid, this.loc, mats, desc, extra);
    }

    update_meshes() {
        let pos = {y: .5};
        assign(pos, this.loc);
        pos.y = 0;
        pos = this.grid.translate(pos);

        for(let m of this.meshes) {
            m.position.x = pos.x;
            m.position.y = pos.y;
            m.position.z = pos.z;
        }
    }

    tick(delta) {
        ///something to do on every frame?
    }

    destroy() {
        for(let m of this.meshes) {
            this.grid.scene.remove(m);
        }
        if(this.object) { this.object.destroy(); }
    }

    _fine_tune() {
        if(this.extra) {
            /// pull configuration from the this.extra
            if(this.extra['solid']) {
                console.log("it is set:");
                console.log(this.extra);
                this.solid = this.extra['solid'];
            }

            if(this.extra['rot']) {
                this.meshes[0].rotation.y += this.extra['rot'];
            }

            if(this.extra['offset-x']) {
                this.meshes[0].position.x += this.extra['offset-x'];
            }

            if(this.extra['offset-z']) {
                this.meshes[0].position.z += this.extra['offset-z'];
            }
        }
    }

    static occupies() { return false; }
}

export default GridObject;
