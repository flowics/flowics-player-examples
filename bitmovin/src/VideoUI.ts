import { PlayerAPI, UIConfig } from 'bitmovin-player';
import {
  UIManager,
  UIContainer,
  BufferingOverlay,
  ErrorMessageOverlay,
  ControlBar,
  Container,
  PlaybackToggleButton,
  VolumeToggleButton,
  VolumeSlider,
  Spacer,
  PlaybackTimeLabel,
  PlaybackTimeLabelMode,
  SeekBar,
  SeekBarLabel,
  FullscreenToggleButton,
  UIFactory,
  SettingsPanelPage,
  SettingsPanelItem,
  VideoQualitySelectBox,
  AudioTrackSelectBox,
  AudioQualitySelectBox,
  SettingsPanel,
  CloseButton,
  TitleBar,
  SettingsToggleButton,
  PlayerUtils,
  PlaybackToggleOverlay,
  CastStatusOverlay,
  RecommendationOverlay,
  MetadataLabel,
  MetadataLabelContent,
  CastToggleButton,
  AirPlayToggleButton,
  Watermark,
  VRToggleButton,
  PictureInPictureToggleButton,
  Component,
} from 'bitmovin-player-ui';
import { FlowicsLiveOverlay } from './FlowicsLiveOverlay';
import { UIConditionContext } from 'bitmovin-player-ui/dist/js/framework/uimanager';
import { i18n } from 'bitmovin-player-ui/dist/js/framework/localization/i18n';
import { FlowicsVodOverlay } from './FlowicsVodOverlay';

interface BaseFlowicsGraphicsConfig {
  graphicsURL: string;
  delay?: number;
}

export interface VODFlowicsGraphicsConfig extends BaseFlowicsGraphicsConfig {
  type: 'vod';
  track: string;
}

export interface LiveFlowicsGraphicsConfig extends BaseFlowicsGraphicsConfig {
  type: 'live'
}

export type FlowicsGraphicsConfig = LiveFlowicsGraphicsConfig | VODFlowicsGraphicsConfig;

export function flowicsSmallScreenUI(flowicsGraphicsConfig: FlowicsGraphicsConfig) {
  let mainSettingsPanelPage = new SettingsPanelPage({
    components: [
      new SettingsPanelItem(
        i18n.getLocalizer('settings.video.quality'),
        new VideoQualitySelectBox()
      ),

      new SettingsPanelItem(i18n.getLocalizer('settings.audio.track'), new AudioTrackSelectBox()),
      new SettingsPanelItem(
        i18n.getLocalizer('settings.audio.quality'),
        new AudioQualitySelectBox()
      ),
    ],
  });

  let settingsPanel = new SettingsPanel({
    components: [mainSettingsPanelPage],
    hidden: true,
    pageTransitionAnimation: false,
    hideDelay: -1,
  });

  settingsPanel.addComponent(new CloseButton({ target: settingsPanel }));

  let controlBar = new ControlBar({
    components: [
      new Container({
        components: [
          new PlaybackToggleButton(),
          new SeekBar({ label: new SeekBarLabel() }),
          new PlaybackTimeLabel({
            timeLabelMode: PlaybackTimeLabelMode.TotalTime,
            cssClasses: ['text-right'],
          }),
        ],
        cssClasses: ['controlbar-top'],
      }),
    ],
  });

  const uiCont = new UIContainer({
    components: [
      new BufferingOverlay(),
      new CastStatusOverlay(),
      new TitleBar({
        components: [
          new MetadataLabel({ content: MetadataLabelContent.Title }),
          new VolumeToggleButton(), // new SettingsToggleButton({ settingsPanel: settingsPanel }),
          new FullscreenToggleButton(),
        ],
      }),
      // settingsPanel,
      (flowicsGraphicsConfig.type == 'live') ? new FlowicsLiveOverlay(flowicsGraphicsConfig) : new FlowicsVodOverlay(flowicsGraphicsConfig),
      new ErrorMessageOverlay(),
      controlBar,
    ],
    cssClasses: ['ui-skin-smallscreen'],
    hideDelay: 2000,
    hidePlayerStateExceptions: [
      PlayerUtils.PlayerState.Prepared,
      PlayerUtils.PlayerState.Paused,
      PlayerUtils.PlayerState.Finished,
    ],
  });

  return uiCont;
}

export function flowicsUI(flowicsGraphicsConfig: FlowicsGraphicsConfig) {
  const controlBar = new ControlBar({
    components: [
      new Container({
        components: [
          new PlaybackTimeLabel({
            timeLabelMode: PlaybackTimeLabelMode.CurrentTime,
            hideInLivePlayback: true,
          }),
          new SeekBar({ label: new SeekBarLabel() }),
          new PlaybackTimeLabel({
            timeLabelMode: PlaybackTimeLabelMode.TotalTime,
            cssClasses: ['text-right'],
          }),
        ],
        cssClasses: ['controlbar-top'],
      }),
      new Container({
        components: [
          new PlaybackToggleButton(),
          new VolumeToggleButton(),
          new VolumeSlider(),
          new Spacer(),
          new FullscreenToggleButton(),
        ],
        cssClasses: ['controlbar-bottom'],
      }),
    ],
  });

  const uiCont = new UIContainer({
    components: [
      new BufferingOverlay(),
      // If no overlay is present, the UI does not react
      // properly. Is a known issue: https://github.com/bitmovin/bitmovin-player-ui/pull/220
      (flowicsGraphicsConfig.type == 'live') ? new FlowicsLiveOverlay(flowicsGraphicsConfig) : new FlowicsVodOverlay(flowicsGraphicsConfig),
      controlBar,
      new ErrorMessageOverlay(),
    ],
    hideDelay: 2000,
    hidePlayerStateExceptions: [
      PlayerUtils.PlayerState.Prepared,
      PlayerUtils.PlayerState.Paused,
      PlayerUtils.PlayerState.Finished,
    ],
  });

  return uiCont;
}




export function buildFlowicsUI(player: PlayerAPI, flowicsGraphicsConfig: FlowicsGraphicsConfig, uiManagerConfig: UIConfig = {}): UIManager {
  // show smallScreen UI only on mobile/handheld devices
  let smallScreenSwitchWidth = 600;

  return new UIManager(
    player,
    [
      // {
      //   ui: flowicsSmallScreenUI(flowicsGraphicsConfig),
      //   condition: (context: UIConditionContext) => {
      //     return (
      //       !context.isAd &&
      //       !context.adRequiresUi &&
      //       context.isMobile &&
      //       context.documentWidth < smallScreenSwitchWidth
      //     );
      //   },
      // },
      {
        ui: flowicsSmallScreenUI(flowicsGraphicsConfig),
      },
    ],
    uiManagerConfig
  );
}
