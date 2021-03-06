import Player from '../player'
import PlayerStatus from './status'
import { shoot, push, find_target_linear } from './attacks'
import AI from './ai'

class GamePlayer extends Player {
    constructor(grid, loc, inventory, facing=0, stats, overlay) {
        super(grid, loc, inventory, facing=facing);

        this.has_turn = true;
        this.stats = stats;
        this.stats.update();
        this.overlay = overlay;
    }

    check_status() {
        this.stats.update();
        if(this.stats.health.value < 1) {
            this.logbox.add_message('it hurts');
        }
    }

    suffer_attack(attack) {
        if(attack['damage']) {
            this.stats.health.value -= attack.damage;
        }
        this.check_status();
    }

    reload() {
        if(!this.stats['chambers']) { return; }
        if(this.stats.ammo.value > 0 && this.stats.chambers.value < this.stats.chambers.max) {
            this.stats.chambers.value++;
            this.stats.ammo.value--;
            this.stats.update();
        }
    }

    show_desc(obj) {
        this.overlay.add_dialog([ { "msg": obj.desc } ]);
    }

    _enemies_exist() {
        return this.grid.event_manager.lists['ai_turn'];
    }

    context_do() {
        let tpos = this._point_in_front()
        let target = this.grid.get(tpos.x, tpos.z);

        if(!target) { return; }

        if(target.object) {
            if(target.object instanceof AI) {
                push(this);
            } else if(target.object.usable) {
                target.object.use(this);
            } else if(this._enemies_exist() &&
                    find_target_linear(this.grid, tpos,
                            { x: this.loc.x - tpos.x, z: this.loc.z - tpos.z })) {
                ///if there are enemies, I have a ranged weapon and I have a target
                ///this is duped below
                shoot(this);
            } else if(target.object.desc) {
                this.show_desc(target.object);
            }
        } else if(this._enemies_exist() &&
                find_target_linear(this.grid, tpos,
                        { x: this.loc.x - tpos.x, z: this.loc.z - tpos.z })) {
            ///if there are enemies, I have a ranged weapon and I have a target
            shoot(this);
        } else if(target.desc) {
            this.show_desc(target);
        }
    }

    input(event) {
        if(!this.has_turn) { return; }
        this.has_turn = false;

        if(event.keyCode == 32) {
            this.context_do();
        }
       /* if(event.keyCode == 32) {
            shoot(this);
        } else if(event.keyCode == 80) {
            push(this);
        } else if(event.keyCode == 82) {
            this.reload();
        } else if(event.keyCode == 84) {
            this.overlay.add_text_particle("It worked", null);
/*
            this.overlay.add_dialog([
                { 'speaker': 'player', 'emote': 'happy', 'prompt': {
                        'msg': "So far, so good, huh?",
                        'choices': [ { 'title': "Yeah!" }, { 'title': "Eh.." }, { 'title': "Not at all" } ]
                    }
                },
                { 'speaker': 'player', 'emote': 'bored', 'msg': "..." },
                { 'speaker': 'player', 'emote': 'sad', 'msg': "I should stop talking to myself.." }
            ]);
        }
*/
        super.input(event);
    }
}

export default GamePlayer;
