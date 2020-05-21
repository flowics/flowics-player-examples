/* eslint-disable no-console */
import { Container, UIManager, UIInstanceManager } from 'bitmovin-player-ui';
import { PlayerEvent, PlayerAPI, PlayerEventBase, TimeChangedEvent } from 'bitmovin-player';
import './FlowicsOverlay.scss';
import { DOM } from 'bitmovin-player-ui/dist/js/framework/dom';
import { ContainerConfig } from 'bitmovin-player-ui/dist/js/framework/components/container';

declare global {
  interface Window {
    Flowics: any;
  }
}

type FlowicsConfig = {
  graphicsURL: string | null;
};

export class FlowicsOverlay extends Container<ContainerConfig> {
  private flowicsConfig: FlowicsConfig = {
    graphicsURL: null,
  };

  private flowicsGraphicsOverlay: any;

  private eventHandler: any;

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
        cssPrefix: 'flowics',
        cssClass: 'overlay',
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

    this.flowicsGraphicsOverlay = new window.Flowics.GraphicsOverlay({
      syncGraphics: true,
      delay: 0,
      enableEventsNotifier: true,
      graphicsUrl: this.flowicsConfig.graphicsURL,
      // graphicsURL:
      //   "https://viz.flowics.com/public/7f1abbadc05d2db270a52cad6360327b/5ea703b94fa8ca5176941496/live",
      className: `${this.config.cssPrefix}graphicsFrame`,
      onGraphicsLoad: this.onGraphicsLoad,
    });

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

    player.on(PlayerEvent.TimeShift, (event: PlayerEventBase) => {
      this.hide();
    });

    player.on(PlayerEvent.TimeShifted, () => {
      this.showOverlayIfNeeded(player);
    });

    player.on(PlayerEvent.TimeChanged, (event: PlayerEventBase) => {
      this.flowicsGraphicsOverlay.notifyVideoSegment((event as TimeChangedEvent).time);
    });
  }

  onGraphicsLoad(flowicsGraphicsOverlay: any) {
    // TODO LLevar esto a configuración externa no dentro de este archivo
    console.log('Flowics Overlay: onGraphicsLoad Called');
    flowicsGraphicsOverlay.setTexts({
      n25: 'Buy USD 2',
      n28: 'Buy USD 5',
    });
    flowicsGraphicsOverlay.show();
  }

  showOverlayIfNeeded(player: PlayerAPI) {
    if (player.isLive()) {
      // if (player.getTimeShift() === 0) {
      this.showOverlay();
      // } else {
      // this.hide();
      // }
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
    return new DOM(this.flowicsGraphicsOverlay.getIframe());
  }

  toDomElement() {
    console.log('Flowics Overlay: toDomElement');
    const mainWrap = new DOM('div', {
      class: this.getCssClasses(),
    }).css({
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: '1',
    });

    return mainWrap;
  }
}
