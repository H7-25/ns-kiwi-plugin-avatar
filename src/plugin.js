/* global kiwi:true */

import md5 from 'md5';
import * as config from './config.js';

kiwi.plugin('avatar', (kiwi) => {
    config.setDefaults();

    kiwi.on('irc.join', (event, net) => {
        setTimeout(() => {
            updateAvatar(net, event.nick);
        });
    });

    kiwi.on('irc.wholist', (event, net) => {
        let nicks = event.users.map((user) => user.nick);
        setTimeout(() => {
            nicks.forEach((nick) => {
                updateAvatar(net, nick, false);
            });
        });
    });

    kiwi.on('irc.account', (event, net) => {
        setTimeout(() => {
            updateAvatar(net, event.nick, true);
        });
    });

    function updateAvatar(net, nick, _force) {
        let force = !!_force;
        let user = kiwi.state.getUser(net.id, nick);
        if (!user) {
            return;
        }

        if (!force && user.avatar && user.avatar.small) {
            return;
        }

        if (!user.account) { return; }
        
        let url = md5(user.account);

        setAvatar(user, url);
    }

    function setAvatar(user, _url) {
        let url = _url;

        user.avatar.small = kiwi.state.setting('plugin-avatar.gatewayURL') + '40/' + url + '.png';
        user.avatar.large = kiwi.state.setting('plugin-avatar.gatewayURL') + 'default/' + url + '.png';
    }
});
