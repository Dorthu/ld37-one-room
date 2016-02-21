import THREE from 'three'

class Grid {
    constructor() {
        this.grid = [];    
        this.scene = new THREE.Scene();
    }

    translate(loc) {
        return { x: loc.x * 6, y: loc.y * 6, z: loc.z * 6 }
    }

    put(x, y, thing) {
        if(this.grid.length < x) { this.grid[x] = []; }
        this.grid[x][y] = thing;
    }

    get(x, y) {
        if(this.grid.length < x) { return null; }
        return this.grid[x][y];
    }

    remove(x, y) { 
        this.put(x, y, null);
    }
}

export default Grid;
