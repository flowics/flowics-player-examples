import { Player, PlayerConfig, PlayerEvent, TimeChangedEvent } from 'bitmovin-player';

import 'bitmovin-player/bitmovinplayer-ui.css';
import './styles.css';
import { buildFlowicsUI } from './VideoUI';
import { UIFactory } from 'bitmovin-player-ui';
import { SOURCES, GRAPHICS, KEYS } from './constants';

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
    const uiInstance = buildFlowicsUI(player, { type: "live", syncGraphics: false, graphicsURL: GRAPHICS.live_demo });

    player.load(SOURCES.vod.parkour).then(
      function () {
        console.log('Successfully created Bitmovin Player instance');
      },
      function (reason) {
        console.log('Error while creating Bitmovin Player instance');
      }
    );
  }
});
