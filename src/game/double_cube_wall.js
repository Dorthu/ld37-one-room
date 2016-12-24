import GridObject from '../grid_object'
import CubeWall from './cube_wall'

class DoubleCubeWall extends GridObject {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);

        this.wall_1 = new CubeWall(grid, loc, mats, desc, {'rot':'x'});
        this.wall_2 = new CubeWall(grid, loc, mats, desc, {'rot':'z'});
    }

    destroy() {
        if(this.wall_1) { this.wall_1.destroy(); }
        if(this.wall_2) { this.wall_2.destroy(); }
    }
}

export default DoubleCubeWall;
