/* eslint-disable no-console */
import { Container, UIManager, UIInstanceManager } from 'bitmovin-player-ui';
import { PlayerEvent, PlayerAPI, PlayerEventBase, TimeChangedEvent } from 'bitmovin-player';
import './FlowicsOverlay.scss';
import { DOM } from 'bitmovin-player-ui/dist/js/framework/dom';
import { ContainerConfig } from 'bitmovin-player-ui/dist/js/framework/components/container';
import { FlowicsGraphicsConfig, VODFlowicsGraphicsConfig } from './VideoUI';

declare global {
  interface Window {
    Flowics: any;
  }
}

export class FlowicsVodOverlay extends Container<ContainerConfig> {
  private graphicsConfig: VODFlowicsGraphicsConfig;
  private flowicsGraphicsOutput: any;
  private player: PlayerAPI | null = null;

  private iFrameInitialized: boolean = false;
  constructor(graphicsConfig: VODFlowicsGraphicsConfig, containerConfig: ContainerConfig = {}) {
    super(containerConfig);

    this.graphicsConfig = graphicsConfig;
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
    this.player = player;
    this.flowicsGraphicsOutput = new window.Flowics.GraphicsOutput({
      sync: {
        mode: window.Flowics.GraphicsOutput.SyncMode.VideoTime,
        track: this.graphicsConfig.track,
      },
      delay: this.graphicsConfig.delay ? this.graphicsConfig.delay : 0,
      graphicsUrl: this.graphicsConfig.graphicsURL,
      className: `${this.config.cssPrefix}graphicsFrame`,
      onGraphicsLoad: this.onGraphicsLoad.bind(this),
    });

    const parseAndLogNodeMessage = (event: any) => {
      try {
        console.log('Parsed Message', JSON.parse(event.message));
      } catch (e) {
        console.error('Failed to Parse Message as JSON. Event: ', event);
      }
    };

    const logEvent = (eventType: any) => (event: any) => {
      console.log(eventType, event);
    };
    const logNodeMessage = logEvent('NodeMessage');

    this.flowicsGraphicsOutput.on('NodeMessage', logNodeMessage);
    this.flowicsGraphicsOutput.on('NodeMessage', parseAndLogNodeMessage);

    // TODO handle on video end properly.

    player.on(PlayerEvent.Playing, (event: PlayerEventBase) => {
      this.showGraphics();
    });

    player.on(PlayerEvent.StallStarted, (event: PlayerEventBase) => {
      this.hide();
    });

    player.on(PlayerEvent.StallEnded, (event: PlayerEventBase) => {
      this.showGraphics();
    });

    player.on(PlayerEvent.PlaybackFinished, (event: PlayerEventBase) => {
      this.hide();
    });

    // player.on(PlayerEvent.TimeShift, (event: PlayerEventBase) => {
    //   this.hide();
    // });

    // player.on(PlayerEvent.TimeShifted, () => {
    //   this.showOverlayIfNeeded(player);
    // });
  }

  onGraphicsLoad(flowicsGraphicsOutput: any) {
    // TODO LLevar esto a configuración externa no dentro de este archivo
    console.log('Flowics Output: Graphics Initialized');

    this.player!.on(PlayerEvent.TimeChanged, (event: PlayerEventBase) => {
      // console.log('Sending Time Changed', (event as TimeChangedEvent).time)
      this.flowicsGraphicsOutput.notifyVideoEvent({
        type: 'TimeChanged',
        time: (event as TimeChangedEvent).time,
      });
    });

    flowicsGraphicsOutput.show();
  }

  showGraphics() {
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
    return new DOM(this.flowicsGraphicsOutput.getIframe());
  }

  toDomElement() {
    console.log('Flowics Output: toDomElement');
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
