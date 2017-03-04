import Pickup from '../pickup'

class ConditionalPickup extends Pickup {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);

        this.hidden = false;
        this.condition = extra['if'];
        this.unset_on_use = extra['once'];
        
        if(this.grid.level.get_value(this.condition) !== 'true') {
            this.grid.post_load_actions.push(() => this.hide());
            this.grid.event_manager.subscribe('property_changed', (e) => this.show(e), this);
        }
    }
    
    hide() {
        this.hidden = true;
        this.grid.scene.remove(this.meshes[0]);
    }

    show(event) {
        ///only show if this was an event for us
        if(!event.detail.data.key == this.condition) { return; }
        if(!event.detail.data.value === true) { return; }

        this.hidden = false;
        this.grid.scene.add(this.meshes[0]);
        this.grid.event_manager.unsubscribe('property_changed', this);
    }

    use(player) {
        if(this.hidden) { return; } /// can't use if we're hidden
        super.use(player);
        if(this.unset_on_use) {
            this.grid.level.set_value(this.condition, false);
        }
    }
}

export default ConditionalPickup;
