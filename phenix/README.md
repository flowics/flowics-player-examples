# Flowics Graphics on Phenix Player

## Run example
Configure you graphics output at `main.js`. 

Run a local HTTP Server (such as `python -m SimpleHTTPServer` or `npm install -g serve; serve -p 8000`)

Access http://localhost:8000/index.html


## Phenix Considerations

Based on https://github.com/PhenixRTS/WebExamples/tree/master/src/ChannelViewer

### View Channel

A simple example viewing a channel with alias `MyChannelAlias` using the Phenix WebSDK Express APIs for channels.
The alias can be changed adding `channelAlias=<REPLACE>

### Run

1. [Publish a stream to the channel](https://github.com/PhenixRTS/WebExamples/blob/master/src/ChannelPublisher).
2. Open our [hosted example](https://phenixrts.com/examples/ChannelViewer).
3. (alternatively) Open index.html in a browser.

### Limitations:

- Browsers with webRTC support will view the channel in real-time. This includes the most recent versions of most popular browsers (Chrome, Firefox, Edge, Safari, Opera).
- Legacy browsers will fall back to live streaming (8+ seconds of latency).

### More

- [API Documentation](https://phenixrts.com/docs/web/#view-a-channel)
- [Browsers' autoplay policies](https://phenixrts.com/docs/faq/index.html#why-isnt-autoplay-working)
- [Devices in battery saver mode](https://phenixrts.com/docs/faq/index.html#why-is-playback-blocked-in-battery-saver-mode)
- [Phenix Platform Documentation](http://phenixrts.com/docs/)
