import { PlayerAPI, UIConfig } from "bitmovin-player";
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
} from "bitmovin-player-ui";
import { FlowicsOverlay } from "./FlowicsOverlay";
import { UIConditionContext } from "bitmovin-player-ui/dist/js/framework/uimanager";

// function ui() {
//   const controlBar = new ControlBar({
//     components: [
//       new Container({
//         components: [
//           new PlaybackTimeLabel({
//             timeLabelMode: PlaybackTimeLabelMode.CurrentTime,
//             hideInLivePlayback: true,
//           }),
//           new SeekBar({ label: new SeekBarLabel() }),
//           new PlaybackTimeLabel({
//             timeLabelMode: PlaybackTimeLabelMode.TotalTime,
//             cssClasses: ["text-right"],
//           }),
//         ],
//         cssClasses: ["controlbar-top"],
//       }),
//       new Container({
//         components: [
//           new PlaybackToggleButton(),
//           new VolumeToggleButton(),
//           new VolumeSlider(),
//           new Spacer(),
//         ],
//         cssClasses: ["controlbar-bottom"],
//       }),
//     ],
//   });

//   const uiCont = new UIContainer({
//     components: [
//       new BufferingOverlay(),
//       // If no overlay is present, the UI does not react
//       // properly. Is a known issue: https://github.com/bitmovin/bitmovin-player-ui/pull/220
//       new FlowicsOverlay(),
//       controlBar,
//       new ErrorMessageOverlay(),
//     ],
//   });

//   return uiCont;
// }

// export function buildUI(videoPlayerInstance: PlayerAPI, uiConfig = {}) {
//   return new UIManager(
//     videoPlayerInstance,
//     [
//       {
//         ui: ui(),
//         condition: (context) => {
//           return true;
//         },
//       },
//     ],
//     uiConfig
//   );
// }

export function flowicsSmallScreenUI() {
  return UIFactory.modernSmallScreenUI();
}

export function flowicsUI() {
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
            cssClasses: ["text-right"],
          }),
        ],
        cssClasses: ["controlbar-top"],
      }),
      new Container({
        components: [
          new PlaybackToggleButton(),
          new VolumeToggleButton(),
          new VolumeSlider(),
          new Spacer(),
          new FullscreenToggleButton(),
        ],
        cssClasses: ["controlbar-bottom"],
      }),
    ],
  });

  const uiCont = new UIContainer({
    components: [
      new BufferingOverlay(),
      // If no overlay is present, the UI does not react
      // properly. Is a known issue: https://github.com/bitmovin/bitmovin-player-ui/pull/220
      new FlowicsOverlay(),
      controlBar,
      new ErrorMessageOverlay(),
    ],
  });

  return uiCont;
}

export function buildFlowicsUI(
  player: PlayerAPI,
  config: UIConfig = {}
): UIManager {
  // show smallScreen UI only on mobile/handheld devices
  let smallScreenSwitchWidth = 600;

  return new UIManager(
    player,
    [
      {
        ui: UIFactory.modernSmallScreenAdsUI(),
        condition: (context: UIConditionContext) => {
          return (
            context.isMobile &&
            context.documentWidth < smallScreenSwitchWidth &&
            context.isAd &&
            context.adRequiresUi
          );
        },
      },
      {
        ui: UIFactory.modernAdsUI(),
        condition: (context: UIConditionContext) => {
          return context.isAd && context.adRequiresUi;
        },
      },
      {
        ui: flowicsSmallScreenUI(),
        condition: (context: UIConditionContext) => {
          return (
            !context.isAd &&
            !context.adRequiresUi &&
            context.isMobile &&
            context.documentWidth < smallScreenSwitchWidth
          );
        },
      },
      {
        ui: flowicsUI(),
        condition: (context: UIConditionContext) => {
          return !context.isAd && !context.adRequiresUi;
        },
      },
    ],
    config
  );
}
