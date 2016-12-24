import { THREE } from '../Three'
import assign from 'object-assign'
import { get_material } from '../texture_lookup'
import GridObject from '../grid_object'

class CubeWall extends GridObject {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);
        const geo = new THREE.PlaneGeometry(6,4);
        const geo2 = new THREE.PlaneGeometry(1,4);
        const m = get_material(mats[0]);
        const m2 = get_material(mats[1]);

        this.solid = true;

        this.meshes = [
            new THREE.Mesh(geo, m),
            new THREE.Mesh(geo2, m2),
            new THREE.Mesh(geo, m),
            new THREE.Mesh(geo2, m2)
        ];

        if(extra && extra['rot'] == 'z') {
                this.meshes = [ this.meshes[1], this.meshes[0], this.meshes[3], this.meshes[2] ];
        }

        for (let i=0; i<4; i++) {
            let m = this.meshes[i];
            let c = {};
            assign(c, this.loc);

            let mod = 1;
            if (i > 1) { mod = -1; }

            console.log(`rot is ${extra['rot']}`);
            if(extra && extra['rot'] == 'z') {
                if (i%2) { c.x += .08 * mod; m.rotation.y = Math.PI / 2 * mod;}
                else { c.z += .5 * mod; m.rotation.y = ( mod > 0 ? 0 : Math.PI * mod ); }
            } else {
                if (i%2) { c.x += .5* mod; m.rotation.y = Math.PI / 2 * mod;}
                else { c.z += .08 * mod; m.rotation.y = ( mod > 0 ? 0 : Math.PI * mod ); }
            }

            c = this.grid.translate(c);
            m.position.x = c.x;
            m.position.y = c.y - 1;
            m.position.z = c.z;

            this.grid.scene.add(m);
        }
    }

    static occupies() { return true; }
}

export default CubeWall;
