import { THREE } from './Three'
import assign from 'object-assign'
import {  get_material } from './texture_lookup'

class Skybox {
    constructor(grid, mats) {
        this.grid = grid;
        this._mats = mats;
        console.log(`got mats ${mats}`);
        const skygeo = new THREE.BoxGeometry(500, 500, 500);

        const lmats = [];
        let m = null;
        for(let i=0; i<6; i++) {
            if(i < mats.length) {  m = get_material(mats[i]); }
            lmats.push(m);
        }

        this.meshes  = [ new THREE.Mesh(skygeo,  new THREE.MeshFaceMaterial(lmats) ) ];
        this.meshes[0].position.y = 0;
        grid.scene.add(this.meshes[0]);
    }

    destroy() {
        this.grid.scene.remove(this.meshes[0]);
    }
}

export default Skybox;
