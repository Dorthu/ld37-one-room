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


        /// find the line between them and us, and then translate it into grid spaces

        /// trace the line across grid spaces to see if there's any obstruction

        ///if there was no obstruction, trigger the event
    }
}

export default LosTrigger;
