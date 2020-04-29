/* eslint-disable no-console */
import { Container, UIManager, UIInstanceManager } from "bitmovin-player-ui";
import { PlayerEvent, PlayerAPI, PlayerEventBase } from "bitmovin-player";
import "./FlowicsOverlay.css";
import { DOM } from "bitmovin-player-ui/dist/js/framework/dom";
import { ContainerConfig } from "bitmovin-player-ui/dist/js/framework/components/container";

type FlowicsConfig = {
  graphicsURL: string | null;
};

export class FlowicsOverlay extends Container<ContainerConfig> {
  private flowicsConfig: FlowicsConfig = {
    graphicsURL: null,
  };

  private iFrameInitialized: boolean = false;
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

  configure(player: PlayerAPI, uiManager: UIInstanceManager) {
    // TODO See how to pass this correctly
    const uiConfig: any = uiManager.getConfig();

    if (!uiConfig.flowics) {
      console.error('UIConfig does not have property "flowics".');
    }

    this.flowicsConfig = uiConfig.flowics;

    // TODO handle on video end properly.

    player.on(PlayerEvent.Playing, (event: PlayerEventBase) => {
      this.showOverlayIfNeeded(player);
    });

    player.on(PlayerEvent.Paused, (event: PlayerEventBase) => {
      this.hide();
    });

    player.on(PlayerEvent.StallStarted, (event: PlayerEventBase) => {
      this.hide();
    });

    player.on(PlayerEvent.StallEnded, (event: PlayerEventBase) => {
      this.showOverlayIfNeeded(player);
    });

    player.on(PlayerEvent.PlaybackFinished, (event: PlayerEventBase) => {
      this.hide();
    });

    player.on(PlayerEvent.TimeShifted, () => {
      this.showOverlayIfNeeded(player);
    });
  }

  showOverlayIfNeeded(player: PlayerAPI) {
    if (player.isLive()) {
      if (player.getTimeShift() === 0) {
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
      src: this.flowicsConfig.graphicsURL!.replace(/&amp;/gi, "&"),
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
