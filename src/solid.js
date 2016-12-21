import GridObject from './grid_object'

class SolidObject extends GridObject {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);

        this.solid = true;
    }

    _fine_tune() {
        if(this.extra) {
            /// pull configuration from the this.extra
            if(this.extra['solid']) {
                this.solid = this.extra['solid'];
            } else {
                this.solid = true;
            }

            if(this.extra['rot']) {
                this.meshes[0].rotation.y += this.extra['rot'];
            }

            if(this.extra['offset-x']) {
                this.meshes[0].position.x += this.extra['offset-x'];
            }

            if(this.extra['offset-z']) {
                this.meshes[0].position.z += eztra['offset-z'];
            }
        }
    }
}

export default SolidObject;
