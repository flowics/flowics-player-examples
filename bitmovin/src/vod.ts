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
    vod_demo:
      'https://viz.flowics.com/public/88e76302345390959725139ec6122a74/5d97e2b51965641b5a54d0b1/live',
    vod_tommy_dev:
      'http://dev.flowics.com:5000/public/b3ece529f435dbd10da611efb8733186/5eb1bd06095eee3e40555ba1/live?profile=player',
    vod_tommy_prod:
      'https://viz.flowics.com/public/b3ece529f435dbd10da611efb8733186/5eb1bd06095eee3e40555ba1/live?profile=player'
  };
  var sources = {
    vod: {
      fullyFeatured: {
        dash: '//bitdash-a.akamaihd.net/content/sintel/sintel.mpd',
        hls: '//bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
        progressive: [
          { url: '//bitdash-a.akamaihd.net/content/sintel/Sintel.mp4', type: 'video/mp4' },
          { url: '//bitdash-a.akamaihd.net/content/sintel/Sintel.webm', type: 'video/webm' }
        ],
        poster: '//bitdash-a.akamaihd.net/content/sintel/poster.png',
        thumbnailTrack: {
          url: '//bitdash-a.akamaihd.net/content/sintel/sprite/sprite.vtt',
        },
        title: 'Sintel',
        description: 'A woman, Sintel, is attacked while traveling through a wintry mountainside. After defeating her attacker and taking his spear, she finds refuge in a shaman\'s hut...',
        markers: [
          { time: 0, title: 'Intro' },
          { time: 102, title: 'Old Guy', duration: 30 },
          { time: 150, title: 'City', cssClasses: ['class1', 'class2'] },
          { time: 200, title: 'Dragon' },
          { time: 370, title: 'Desert' },
          { time: 385, title: 'Bamboo Forest' },
          { time: 410, title: 'Winter again' },
          { time: 755, title: 'Credits' },
        ],
        recommendations: [
          { title: 'Recommendation 1: The best video ever', url: 'http://bitmovin.com', thumbnail: 'http://placehold.it/300x300', duration: 10.4 },
          { title: 'Recommendation 2: The second best video', url: 'http://bitmovin.com', thumbnail: 'http://placehold.it/300x300', duration: 64 },
          { title: 'Recommendation 3: The third best video of all time', url: 'http://bitmovin.com', thumbnail: 'http://placehold.it/300x300', duration: 195 },
        ],
      },
      parkour: {
        hls:
          'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
        poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
      },
      tommy: {
        hls: 'https://cdn3.wowza.com/2/VHI3OE96NENFeVps/aDJFeG9x/hls/pgdj3vqd/playlist.m3u8'
      }
    }
  };

  var container = document.getElementById('bitmovin-player');
  if (container) {
    const player = new Player(container, config);
    const track = 'https://gist.githubusercontent.com/fzunino/366d5fc9a822c5a53386b4937f2dc6ee/raw/46390343b29eda1b24224e5a2f829bef9568e20a/tommy-live-pilot-graphics.json';
    const uiInstance = buildFlowicsUI(player, { type: "vod", track, graphicsURL: graphics.vod_tommy_prod, delay: -1000 });



    player.load(sources.vod.tommy).then(
      function () {
        console.log('Successfully created Bitmovin Player instance');
        const enSubtitle = {
          id: "sub1",
          lang: "en",
          label: "English",
          url: "https://gist.githubusercontent.com/fzunino/d5d5fcac7ddbc375c2ab2e358c504274/raw/169e487573b0d6fa503956c97915c733d13120b7/example-subs-en.vtt",
          kind: "subtitle"
        };
        const esSubtitle = {
          id: "sub2",
          lang: "es",
          label: "Español",
          url: "https://gist.githubusercontent.com/fzunino/d5d5fcac7ddbc375c2ab2e358c504274/raw/169e487573b0d6fa503956c97915c733d13120b7/example-subs-es.vtt",
          kind: "subtitle"
        };
        player.subtitles.add(enSubtitle);
        player.subtitles.add(esSubtitle);

      },
      function (reason) {
        console.log('Error while creating Bitmovin Player instance');
      }
    );

    player.on(PlayerEvent.TimeChanged, (event) => {
      document.getElementById('time')!.innerText =
        (event as TimeChangedEvent).time.toString();
      ;
    });
  }
});
