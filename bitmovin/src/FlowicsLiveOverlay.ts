/* eslint-disable no-console */
import { Container, UIManager, UIInstanceManager } from 'bitmovin-player-ui';
import { PlayerEvent, PlayerAPI, PlayerEventBase, TimeChangedEvent } from 'bitmovin-player';
import './FlowicsOverlay.scss';
import { DOM } from 'bitmovin-player-ui/dist/js/framework/dom';
import { ContainerConfig } from 'bitmovin-player-ui/dist/js/framework/components/container';
import { LiveFlowicsGraphicsConfig } from './VideoUI';

declare global {
  interface Window {
    Flowics: any;
  }
}

export class FlowicsLiveOverlay extends Container<ContainerConfig> {
  private flowicsConfig: LiveFlowicsGraphicsConfig;

  private flowicsGraphicsOverlay: any;

  private eventHandler: any;

  private iFrameInitialized: boolean = false;
  constructor(graphicsConfig: LiveFlowicsGraphicsConfig, containerConfig: ContainerConfig = {}) {
    super(containerConfig);

    this.flowicsConfig = graphicsConfig;
    this.iFrameInitialized = false;

    this.config = this.mergeConfig(
      containerConfig,
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
    this.flowicsGraphicsOverlay = new window.Flowics.GraphicsOverlay({
      syncGraphics: this.flowicsConfig.syncGraphics,
      delay: 0,
      enableEventsNotifier: true,
      graphicsUrl: this.flowicsConfig.graphicsURL,
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
    console.log('Flowics Overlay: onGraphicsLoad Called');
    flowicsGraphicsOverlay.show();
  }

  showOverlayIfNeeded(player: PlayerAPI) {
    if (player.isLive()) {
      this.showOverlay();
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
