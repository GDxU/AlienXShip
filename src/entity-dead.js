class entity_deadgod_t extends entity_t {
    _init () {
        this._animation_time = 0;
        this._select_target_counter = 0;
        this._target_x = this.x;
        this._target_z = this.z;
        this.h = 45;
        this.discovered = false;
    }

    _update () {
        let t = this,
            txd = t.x - t._target_x,
            tzd = t.z - t._target_z,
            xd = t.x - entity_player.x,
            zd = t.z - entity_player.z,
            dist = _math.sqrt (xd * xd + zd * zd);
        t._select_target_counter -= time_elapsed;
        // select new target after a while
        if (t._select_target_counter < 0 && dist < 64) {
            t._select_target_counter = _math.random () * 0.5 + 0.3;
            t._target_x = entity_player.x;
            t._target_z = entity_player.z;
        }
        // set velocity towards target
        if (dist > 5) {
            t.ax = _math.abs (txd) > 2 ? (txd > 0 ? -148 : 148) : 0;
            t.az = _math.abs (tzd) > 2 ? (tzd > 0 ? -148 : 148) : 0;
        } else {
            t.ax = t.az = 0;
        }
        if (dist < 48 && this.discovered === false) {
            terminal_show_notice (
                'DEAD MINISTER DISCOVERED\n' +
                'BE ALERTED...'
            );
            this.discovered = true;
        }
        super._update ();
        this._animation_time += time_elapsed;
        this.s = 33 + ((this._animation_time * 15) | 0) % 3;
    }

    _receive_damage (from, amount) {
        super._receive_damage (from, amount);
        this.vx = from.vx * 1.2;
        this.vz = from.vz * 1.2;
        this._spawn_particles (15);
    }

    _check (other) {
        // slightly bounce off from other spiders to separate them
        if (other instanceof entity_deadgod_t) {
            let
                axis = (_math.abs (other.x - this.x) > _math.abs (other.z - this.z)
                    ? 'x'
                    : 'z'),
                amount = this[axis] > other[axis] ? 0.6 : -0.6;

            this['v' + axis] += amount;
            other['v' + axis] -= amount;
        }

        // hurt player
        else if (other instanceof entity_player_t) {
            this.vx *= -1.1;
            this.vz *= -1.1;
            other._receive_damage (this, 2);
        }
    }

    _kill () {
        super._kill ();
        new entity_explosion_t (this.x, 0, this.z, 0, 26);
        camera_shake = 10;
        audio_play (audio_sfx_explode);
    }
}
