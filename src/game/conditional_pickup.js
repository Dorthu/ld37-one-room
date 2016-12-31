import Pickup from '../pickup'

class ConditionalPickup extends Pickup {
    constructor(grid, loc, mats, desc, extra) {
        super(grid, loc, mats, desc, extra);

        this.hidden = false;
        this.condition = extra['if'];
        this.unset_on_use = extra['once'];
        
        if(this.grid.level.get_value(this.condition) !== 'true') {
            this.grid.post_load_actions.push(() => this.hide());
        }
    }
    
    hide() {
        this.hidden = true;
        this.grid.scene.remove(this.meshes[0]);
    }

    show() {
        this.hidden = false;
        this.grid.scene.add(this.meshes[0]);
    }

    use(player) {
        super.use(player);
        if(this.unset_on_use) {
            this.grid.level.set_value(this.condition, false);
        }
    }
}

export default ConditionalPickup;
