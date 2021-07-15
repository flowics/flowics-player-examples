# Flowics Graphics on Bitmovin Player

## Run example

> Install dependencies and run

```shell
$ npm install
$ npm run start
```

## Demos

### Live Example
URL: http://localhost:1234/live.html

Graphics over a live video with high latency.
Control operations (Overlays IN/OUT, texts change, etc) are applied in sync with video segment time, adjusting to different latencies on player devices. 

### Fake Live
URL: http://localhost:1234/flive.html

Graphics over a VOD asset simulating a live video with low latency.
Control operations (Overlays IN/OUT, texts change, etc) are applied in realtime. 

### VOD
URL: http://localhost:1234/vod.html

Graphics over a VOD asset.
Control operations (Overlays IN/OUT, texts change, etc) are defined in a track file and are applied on demand in each player instance. 