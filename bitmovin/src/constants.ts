export const KEYS = {
  bitmovin: 'REPlACE-WITH-YOUR-KEY'
};

export const GRAPHICS = {
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

export const SOURCES = {
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
      webinar: {
        hls: 'https://cdn3.wowza.com/1/OUdza3A1S1YwZE1W/emQxbnNo/hls/live/playlist.m3u8',
        poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
      }
    },
    cnn: {
      dash: 'http://demo-dash-live.zahs.tv/hd/manifest.mpd?timeshift=100',
      poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
    },
  },
};