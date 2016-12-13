import GridObject from '../grid_object'

class LosTrigger extends GridObject {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);

        //this.range = extra['range'] ? extra['range'] : Infinity;

        this.grid.event_manager.subscribe('player_moved', e => this.trigger(e), this);
        this.grid.event_manager.subscribe('player_turned', e => this.trigger(e), this);
    }

    trigger(event) {
        const player_point = this.grid.translate(this.grid.player.loc);
        const this_point = this.grid.translate(this.loc);
        const player_facing = this.grid.player.facing;

        /// determine required arc - if there's no way they can see us, then don't
        /// waste time checking
        const delta_loc = { x: this.loc.x - this.grid.player.loc.x, z: this.loc.z - this.grid.player.loc.z };
        console.log(delta_loc);
        /*
            |    \  2   /
            |      \  /
            |   1   X   3
            |     /   \
          z |   /   0   \
            +--------------
              x
            y = x -> if bigger, in quadrant 1 or 2
            y = -x -> if bigger, in quadrant 2 or 3
        */
        let in_fov = false;
        if( delta_loc.z == delta_loc.x ) { /// on line y = x
            if(delta_loc.z > 0 && player_facing > 1 ) {
                in_fov = true;
            } else if( delta_loc.z < 0 && player_facing < 2) {
                in_fov = true;
            }
        } else if( delta_loc.z == -delta_loc.x ) { /// on line y = -x
            if(delta_loc.z > 0 && (player_facing == 2 || player_facing == 1)) {
                in_fov = true;
            } else if(delta_loc.z < 0 && (player_facing == 0 || player_facing == 3)) {
                in_fov = true;
            }
        } else { /// otherwise, we're not
            let one_or_two = false, two_or_three = false;
            if( delta_loc.z > delta_loc.x ) { one_or_two = true; }
            if( delta_loc.z > -delta_loc.x ) { two_or_three = true; }

            const quadrant = one_or_two ? two_or_three ? 2 : 1 : two_or_three ? 3 : 0;
            console.log(`quadrant is ${quadrant} and facing is ${player_facing}`);

            if(quadrant == player_facing) { in_fov = true; }
        }

        if(!in_fov) { console.log("not in fov!"); return; }
        console.log("in fov!");

        /// find the line between them and us, and then translate it into grid spaces

        /// trace the line across grid spaces to see if there's any obstruction

        ///if there was no obstruction, trigger the event
    }
}

export default LosTrigger;
