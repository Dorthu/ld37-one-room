import { store_get, store_set, store_set_prefix, store_set_global } from '../persistence_manager'

class EventListener {
    constructor(grid, triggers) {
        this.grid = grid;
        this.triggers = triggers;
        for(let _ of Object.keys(triggers)) {
            this.grid.event_manager.subscribe(_, e => this.handle(e), this);
        }
    }

    handle(event) {
        let cur = this.triggers[event.type];
        if(!cur) {
            console.log("Event Listener got unexpected callback for event!");
            console.log(event);
            return;
        }

        if(cur['requirements']) {
            for(let r of cur.requirements) {
                if(typeof(r) == 'string') {
                    if(!store_get(r)) { return; }
                } else if(!r['type'] || r['type'] == 'event') {
                    if(!store_get(r['event'])) {
                        if(r['else']) {
                            this.grid.event_manager.dispatchArbitrary(r['else']);
                            return; /// TODO - does this break requirements with no else?
                        }
                    }
                } else if(r['type'] && r['type'] == 'position') {
                    if(this.grid.player.loc.x != r['x'] ||
                            this.grid.player.loc.z != r['z']) {
                        if(r['else']) {
                            this.grid.event_manager.dispatchArbitrary(r['else']);
                        }
                        return; /// TODO - does this break requirements with no else?
                    }
                }
            }
        }

        if(cur['once']) {
            if(store_get(event.type)) { return; }
        }

        if(cur['once'] || cur['set-on-fire']) {
            store_set(event.type, true);
        }

        if(cur['type'] == 'dialog') {
            this.grid.player.overlay.add_dialog(this.grid.level.get_dialog(cur['dialog']));
        }
    }
}

export default EventListener;
