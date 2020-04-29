import { Player } from "bitmovin-player";

import "bitmovin-player/bitmovinplayer-ui.css";
import "./styles.css";
import { buildUI, buildFlowicsUI } from "./VideoUI";
import { UIFactory } from "bitmovin-player-ui";

document.addEventListener("DOMContentLoaded", function (event) {
  var config = {
    key: "REPLACE-WITH-YOUR-KEY",
    playback: {
      playsInline: true,
      autoplay: true,
    },
    ui: false,
  };
  var uiConfig = {
    flowics: {
      graphicsURL:
        "https://viz.flowics.com/public/88e76302345390959725139ec6122a74/5d97e2b51965641b5a54d0b1/live",
    },
  };
  var source = {
    hls:
      "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8",
    // "https://cdn3.wowza.com/1/bGxnZ2dzbjk3TEJr/SVd1TlZu/hls/live/playlist.m3u8",
    dash: "http://demo-dash-live.zahs.tv/hd/manifest.mpd?timeshift=100",

    poster:
      "https://bitdash-a.akamaihd.net/content/MI201109210084_1/poster.jpg",
  };

  var container = document.getElementById("bitmovin-player");
  if (container) {
    const player = new Player(container, config);
    const uiInstance = buildFlowicsUI(player, uiConfig);
    // const uiInstance = UIFactory.buildDefaultUI(player, {});

    player.load(source).then(
      function () {
        console.log("Successfully created Bitmovin Player instance");
      },
      function (reason) {
        console.log("Error while creating Bitmovin Player instance");
      }
    );
  }
});
