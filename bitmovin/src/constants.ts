export const KEYS = {
  bitmovin: 'REPlACE-WITH-YOUR-KEY',
};

export const GRAPHICS = {
  fer: {
    prod_buy:
      'https://viz.flowics.com/public/7f1abbadc05d2db270a52cad6360327b/5ea703b94fa8ca5176941496/live',
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
    premier: {
      hls:
        // 'https://flowics-pruebas.s3-us-west-2.amazonaws.com/vod/livars3-1-edit2/livars3-1-edit2.m3u8',
        'https://flowics-pruebas.s3-us-west-2.amazonaws.com/vod/livars3-1-highlights/livars3-1-highlights.m3u8',
      poster:
        'https://flowics-pruebas.s3-us-west-2.amazonaws.com/vod/livars3-1-edit2/premier-league-logo-fullhd.png',
    },
  },
  live: {
    wowza: {
      fer: {
        hls: 'https://cdn3.wowza.com/1/djFhR1R1Rm5zN24r/K21uYkd0/hls/live/playlist.m3u8',
        poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
      },
      webinar: {
        hls: 'https://cdn3.wowza.com/1/OUdza3A1S1YwZE1W/emQxbnNo/hls/live/playlist.m3u8',
        poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
      },
    },
    cnn: {
      dash: 'http://demo-dash-live.zahs.tv/hd/manifest.mpd?timeshift=100',
      poster: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg',
    },
  },
};
