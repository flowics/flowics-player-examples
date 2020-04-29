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
} from "bitmovin-player-ui";
import { FlowicsOverlay } from "./FlowicsOverlay";

function ui() {
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

export function buildUI(videoPlayerInstance: PlayerAPI, uiConfig = {}) {
  return new UIManager(
    videoPlayerInstance,
    [
      {
        ui: ui(),
        condition: (context) => {
          return true;
        },
      },
    ],
    uiConfig
  );
}
