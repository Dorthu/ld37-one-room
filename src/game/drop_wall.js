import TallWall from '../tall_wall'

class DropWall extends TallWall {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);
        
        for(let cur of this.meshes) {
            cur.position.y -= 6;
        }
    }
}

export default DropWall;
