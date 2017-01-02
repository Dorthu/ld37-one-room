import ConditionalPickup from './conditional_pickup'

class ConditionalEventPickup extends ConditionalPickup {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);
        
        this.event = extra['event'];
        this.event_extra = extra['event_extra'];
    }

    use(player) {
        if(this.unset_on_use) {
            this.grid.level.set_value(this.condition, false);
        }

        this.grid.event_manager.dispatchArbitrary(this.event, this.event_extra);
    }
}

export default ConditionalEventPickup;
