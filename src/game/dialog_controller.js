import DialogBox from './dialog'
import DialogChoice from './dialog_choice'
import { store_set } from '../persistence_manager'

class DialogController {
    constructor(overlay, dialog) {
        this.overlay = overlay;
        this.dialog = dialog;

        this.cur = 0;
        this.cbox = null;

        this.show();
    }

    show() {
        let result = null;
        if(this.cbox) {
            result = this.cbox.remove();
        }

        if(result) {
            if(result['type'] == 'goto') {
                this.overlay.remove_dialog();
                this.overlay.add_dialog(this.overlay.grid.level.get_dialog(result['target']));
                return;
            } else if(result['type'] == 'event') {
                this.overlay.grid.event_manager.dispatchArbitrary(result['target'], result['detail']);
            }
        }

        if(this.cur >= this.dialog.length) { this.overlay.remove_dialog(); return; }

        let c = this.dialog[this.cur++];
        if(c['prompt']) {
            let left = c['speaker'] != 'player';
            let img = c['speaker']+'/'+( c['emote'] ? c['emote'] : 'default');
            this.cbox = new DialogChoice(c['prompt'], left ? img : null, !left ? img : null);
        } else if(c.type == 'event') {
            this.overlay.remove_dialog(); /// TODO - maybe only sometimes?
            this.overlay.grid.event_manager.dispatchArbitrary(c['target'], c['detail']);
        } else if(c.type == 'set') {
            this.overlay.remove_dialog(); /// TODO - maybe only sometimes?
            store_set(c.key, c.value);
            this.overlay.grid.event_manager.dispatchArbitrary('property_changed', {'key':c.key,'value':c.value});
        } else if(c.speaker == 'player') {
            this.cbox = DialogBox.player_dialog(c.msg, c.emote);
        } else if(!c['speaker']) {
            this.cbox = DialogBox.no_speaker_dialog(c.msg);
        } else {
            this.cbox = DialogBox.character_dialog(c.msg, c.speaker, ( c['emote'] ? c.emote : 'default' ));
        }
    }

    input(event) {
        if(event.keyCode == 32) {
            this.show();
        } else if(this.cbox) {
            this.cbox.input(event);
        }
    }
}

export default DialogController;
