import { Player, PlayerConfig, PlayerEvent, TimeChangedEvent } from 'bitmovin-player';

import 'bitmovin-player/bitmovinplayer-ui.css';
import './styles.css';
import { buildFlowicsUI } from './VideoUI';
import { UIFactory } from 'bitmovin-player-ui';

const Flowics = {};

document.addEventListener('DOMContentLoaded', function (event) {
  var config: PlayerConfig = {
    key: 'REPLACE-WITH-YOUR-KEY',
    playback: {
      playsInline: true,
      autoplay: true,
      muted: true,
    },
    ui: false,
  };
  const graphics = {
    fer: {
      dev_buy:
        'http://dev.flowics.com:5000/public/7f1abbadc05d2db270a52cad6360327b/5ea703b94fa8ca5176941496/live',
      prod_buy:
        'https://viz.flowics.com/public/7f1abbadc05d2db270a52cad6360327b/5ea703b94fa8ca5176941496/live',
    },
    marc: {
      buy:
        'http://dev.flowics.com:5000/public/b0a621640be089b04dd04f3914f8b8c7/5eb5a8c53eb022227539b1be/live',
    },
    live_demo:
      'https://viz.flowics.com/public/88e76302345390959725139ec6122a74/5d97e2b51965641b5a54d0b1/live',
  };
  var uiConfig = {
    flowics: {
      graphicsURL: graphics.live_demo,
    },
  };
  var sources = {
    vod: {
      parkour: {
        hls:
          'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
        poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
      },
    },
    live: {
      wowza: {
        fer: {
          hls: 'https://cdn3.wowza.com/1/djFhR1R1Rm5zN24r/K21uYkd0/hls/live/playlist.m3u8',
          poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
        },
        marc: {
          hls: 'https://cdn3.wowza.com/1/NjBlYVp0VVVIT2x5/c1N0WG9l/hls/live/playlist.m3u8',
          poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
        },
      },
      cnn: {
        dash: 'http://demo-dash-live.zahs.tv/hd/manifest.mpd?timeshift=100',
        poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
      },
    },
  };

  var container = document.getElementById('bitmovin-player');
  if (container) {
    const player = new Player(container, config);
    const uiInstance = buildFlowicsUI(player, uiConfig);

    player.load(sources.live.cnn).then(
      function () {
        console.log('Successfully created Bitmovin Player instance');
      },
      function (reason) {
        console.log('Error while creating Bitmovin Player instance');
      }
    );

    player.on(PlayerEvent.TimeChanged, (event) => {
      document.getElementById('timestamp')!.innerText = new Date(event.timestamp).toString();
      document.getElementById('time')!.innerText = new Date(
        (event as TimeChangedEvent).time * 1000
      ).toString();
      document.getElementById('delay')!.innerText = (
        event.timestamp -
        (event as TimeChangedEvent).time * 1000
      ).toString();
    });
  }
});
