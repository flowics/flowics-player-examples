import { Player, PlayerConfig, PlayerEvent, TimeChangedEvent } from 'bitmovin-player';

import 'bitmovin-player/bitmovinplayer-ui.css';
import './styles.css';
import { buildFlowicsUI } from './VideoUI';
import { UIFactory } from 'bitmovin-player-ui';
import { SOURCES, GRAPHICS, KEYS } from './constants';
import { getGraphicsUrl } from './util';

const Flowics = {};

document.addEventListener('DOMContentLoaded', function (event) {
  var config: PlayerConfig = {
    key: KEYS.bitmovin,
    playback: {
      playsInline: true,
      autoplay: true,
      muted: true,
    },
    ui: false,
  };

  var container = document.getElementById('bitmovin-player');
  if (container) {
    const player = new Player(container, config);
    const uiInstance = buildFlowicsUI(player, {
      type: 'live',
      syncGraphics: false,
      graphicsURL: getGraphicsUrl() || GRAPHICS.live_demo,
    });

    player.load(SOURCES.vod.premier).then(
      function () {
        console.log('Successfully created Bitmovin Player instance');
      },
      function (reason) {
        console.log('Error while creating Bitmovin Player instance');
      }
    );
  }
});
