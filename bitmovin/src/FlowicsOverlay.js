/* eslint-disable no-console */
import { Container } from "bitmovin-player-ui";
import { PlayerEvent } from "bitmovin-player";
import "./FlowicsOverlay.css";
import { DOM } from "bitmovin-player-ui/dist/js/framework/dom";

export class FlowicsOverlay extends Container {
  constructor(config = {}) {
    super(config);

    this.flowicsConfig = {
      graphicsURL: null,
    };
    this.iFrameInitialized = false;

    this.config = this.mergeConfig(
      config,
      {
        cssPrefix: "flowics",
        cssClass: "overlay",
        hidden: true,
        components: [],
      },
      this.config
    );
  }

  configure(player, uiManager) {
    const uiConfig = uiManager.getConfig();

    if (!uiConfig.flowics) {
      console.error('UIConfig does not have property "flowics".');
    }

    this.flowicsConfig = uiConfig.flowics;

    // TODO handle on video end properly.

    player.on(PlayerEvent.Playing, (/*event: PlayerEventBase*/) => {
      this.showOverlayIfNeeded(player);
    });

    player.on(PlayerEvent.Paused, (/*event: PlayerEventBase*/) => {
      this.hide();
    });

    player.on(PlayerEvent.StallStarted, (/*event: PlayerEventBase*/) => {
      this.hide();
    });

    player.on(PlayerEvent.StallEnded, (/*event: PlayerEventBase*/) => {
      this.showOverlayIfNeeded(player);
    });

    player.on(PlayerEvent.PlaybackFinished, (/*event: PlayerEventBase*/) => {
      this.hide();
    });

    player.on(PlayerEvent.TimeShifted, () => {
      this.showOverlayIfNeeded(player);
    });
  }

  showOverlayIfNeeded(player) {
    if (player.isLive()) {
      if (player.getTimeShift() == 0) {
        this.showOverlay();
      } else {
        this.hide();
      }
    } else {
      this.showOverlay();
    }
  }

  showOverlay() {
    this.renderIFrameMaybe();
    this.show();
  }

  renderIFrameMaybe() {
    if (this.iFrameInitialized) {
      return;
    }
    const iframe = this.buildIframe();

    this.getDomElement().append(iframe);
    this.iFrameInitialized = true;
  }

  buildIframe() {
    return new DOM("iframe", {
      class: `${this.config.cssPrefix}graphicsFrame`,
      src: this.flowicsConfig.graphicsURL.replace(/&amp;/gi, "&"),
    }).css({
      width: "100%",
      height: "100%",
      border: "none",
    });
  }

  toDomElement() {
    const mainWrap = new DOM("div", {
      class: this.getCssClasses(),
    }).css({
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: "1",
    });

    return mainWrap;
  }
}
