import { THREE, geo } from './Three'
import assign from 'object-assign'
import SolidObject from './solid'
import { get_material } from './texture_lookup'

class Wall extends SolidObject {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);

        const lmats = [];
        let m = null;
        for(let i=0; i<4; i++) {
            if(i < mats.length) {  m = get_material(mats[i]); }
            lmats.push(m);
        }

        this.meshes = [
            new THREE.Mesh(geo, lmats[0]),
            new THREE.Mesh(geo, lmats[1]),
            new THREE.Mesh(geo, lmats[2]),
            new THREE.Mesh(geo, lmats[3])
        ];

        for (let i=0; i<4; i++) {
            let m = this.meshes[i];
            let c = {};
            assign(c, this.loc);

            let mod = 1;
            if (i > 1) { mod = -1; }
            if (i%2) { c.x += .5 * mod; m.rotation.y = Math.PI / 2 * mod;}
            else { c.z += .5 * mod; m.rotation.y = ( mod > 0 ? 0 : Math.PI * mod ); }

            c = this.grid.translate(c);
            m.position.x = c.x;
            m.position.z = c.z;

            this.grid.scene.add(m);
        }
    }
}

export default Wall;
