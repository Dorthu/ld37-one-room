import GridObject from './grid_object'

class Switch extends GridObject {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);

        this.event = extra['event'];
        this.once = extra['once'];
        this.key = extra['key'];

        this.usable = true;

        if(this.once) {
            if(this.grid.level.get_value(this.key) !== true) {
                this.usable = false;
            }
        }
    }

    use(player) {
        this.grid.event_manager.dispatchArbitrary(this.event);
        if(this.once) {
            this.usable = false;
            this.grid.level.set_value(this.key, false);
        }
    }
}

export default Switch;
