import Space from '../space'

class DropSpace extends Space {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);

	this.meshes[0].position.y -= 1;
    }
}

export default DropSpace;
