import AI from './ai';

function find_target_immediate(grid, loc) {
    let o = grid.get(loc.x, loc.z);
    if(o['object'] && o.object instanceof AI) {
        return o.object;
    }
}

export function find_target_linear(grid, start, dir) {
    let c = start;
    while(true) {
        let o = grid.get(c.x, c.z);
        if(!o) { return; }
        if(o['object'] && o.object instanceof AI) { return o.object; }
        if(o.solid || o['object'] && o.object.solid) { return; }
        c = { x: c.x - dir.x, z: c.z - dir.z };
    }
}

///this came from here:
/// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
}

/// shooting attack hook - below helpers are not exported
export function shoot(player) {
    ///no ammo for ranged weapon in this game
    player.overlay.add('shoot-up', e => shoot_lower(player));
}

function shoot_lower(player) {
    ///do damage
    let pif = player._point_in_front();
    let hit = find_target_linear(player.grid, pif, { x: player.loc.x - pif.x, z: player.loc.z - pif.z });
    if(hit) {
        let damage = getRandomInt(0, 20);
        hit.suffer_attack({ damage: damage });
    }
    player.overlay.add('shoot-down', e => shoot_complete(player));
}

function shoot_complete(player) {
    player.logbox.add_message('shot');
}

///push attack hook
export function push(player) {
    player.overlay.add('push-anim', e => push_activate(player), { anim_rate: 80 });
}

function push_activate(player) {
    let hit = find_target_immediate(player.grid, player._point_in_front());
    if(hit) {
        ///do the attack
        const pdir = { x:  hit.loc.x - player.loc.x, y: hit.loc.y, z: hit.loc.z - player.loc.z};
        const gpos = { x: hit.loc.x + pdir.x, y: pdir.y, z: hit.loc.z + pdir.z };
        let o = player.grid.get(gpos.x, gpos.z);
        if(o && !o['object'] && player.grid.can_move_to(gpos)) {
            player.grid.object_move(hit, gpos);
        }
    }
}
