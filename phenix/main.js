/**
 * Copyright 2019 Phenix Real Time Solutions, Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var sdk = window['phenix-web-sdk'];
var isMobileAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isOtherMobile = /Android|webOS|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
  navigator.userAgent
);

// Video element to view channel with
var videoElement = document.getElementById('myVideoId');

// Alias to be used to publish/create/join channel
var channelAlias = 'REPLACE-WITH-YOUR-ALIAS';

// Flowics Graphics
// CHANGE TO USE YOUR GRAPHICS-OUTPUT
var flowicsGraphicsUrl =
  'https://viz.flowics.com/public/88e76302345390959725139ec6122a74/5d97e2b51965641b5a54d0b1/live';

// Authenticate against our demo backend. Not for production use.
// See our admin api for more info how to setup your own backend
// https://phenixrts.com/docs/#admin-api
var backendUri = 'https://demo-integration.phenixrts.com/pcast';

// Features to use with channel
// If WebRTC is not supported then fall back to live streaming (~10 second latency) with DASH/HLS
var features = ['real-time', 'dash', 'hls'];

var adminApiProxyClient = new sdk.net.AdminApiProxyClient();

adminApiProxyClient.setBackendUri(backendUri);
adminApiProxyClient.setAuthenticationData({
  userId: 'my-user-id-that-is-NOT-related-to-application-id',
  password: 'my-password-that-is-NOT-related-to-secret',
});

var channelExpressOptions = {
  features: features,
  adminApiProxyClient: adminApiProxyClient,
};

var joinChannelOptions = {
  alias: channelAlias,
  videoElement: videoElement,
  // Select the most recent publisher in the channel
  streamSelectionStrategy: 'most-recent',
  // Alternatively, select one of multiple High-Availability publishers in the channel
  // streamSelectionStrategy: 'high-availability'
};

// Support customizations
try {
  var params = window.location.search.substring(1).split('&');

  for (var i = 0; i < params.length; i++) {
    if (params[i].indexOf('channelAlias=') === 0) {
      joinChannelOptions.alias = params[i].substring('channelAlias='.length);
    }

    if (params[i].indexOf('backendUri=') === 0) {
      adminApiProxyClient.setBackendUri(params[i].substring('backendUri='.length));
    }

    if (params[i].indexOf('features=') === 0) {
      channelExpressOptions.features = params[i].substring('features='.length).split(',');
    }

    if (params[i] === 'treatBackgroundAsOffline') {
      channelExpressOptions.treatBackgroundAsOffline = true;
    }

    if (params[i].indexOf('edgeAuthToken=') === 0) {
      // Use EdgeAuth token instead  for auth and stream
      var edgeAuthToken = params[i].substring('edgeAuthToken='.length);

      channelExpressOptions.authToken = edgeAuthToken;
      joinChannelOptions.streamToken = edgeAuthToken;

      channelExpressOptions.adminApiProxyClient = new sdk.net.AdminApiProxyClient();
      channelExpressOptions.adminApiProxyClient.setRequestHandler(function handleRequestCallback(
        requestType,
        data,
        callback
      ) {
        // The SDK made a request for a token b/c using of edge token failed.
        // The default behavior is to return 'unauthorized' which results in the stream being offline.
        // This should trigger the customer's custom authentication workflow.
        return callback(null, { status: 'unauthorized' });
      });
    }
  }
} catch (e) {
  console.error(e);
}

// Instantiate the instance of the ChannelExpress
// IMPORTANT: This should happen at the earliest possible time after the app is started.
var channel = new sdk.express.ChannelExpress(channelExpressOptions);

var disposables = [];
function joinChannel() {
  channel.joinChannel(
    joinChannelOptions,
    function joinChannelCallback(error, response) {
      if (error) {
        console.error('Unable to join channel', error);

        setUserMessage(
          'joinChannel()::joinChannelCallback(error, response) returned error=' + error.message
        );

        // Handle error
        return;
      }

      setUserMessage(
        'joinChannel()::joinChannelCallback(error, response) returned response.status=' +
          response.status
      );

      if (response.status !== 'ok') {
        // Handle error
        console.warn('Unable to join room, status: ' + response.status);

        return;
      }

      // Successfully joined channel
      if (response.channelService) {
        // Do something with channelService
      }
    },
    function subscriberCallback(error, response) {
      for (var i = 0; i < disposables.length; i++) {
        disposables[i].dispose();
      }

      disposables.length = 0;

      if (error) {
        console.error('Unable to subscribe to channel', error);

        setUserMessage(
          'joinChannel()::subscriberCallback(error, response) returned error=' + error.message
        );

        // Handle error
        return;
      }

      setUserMessage(
        'joinChannel()::subscriberCallback(error, response) returned response.status=' +
          response.status
      );

      if (response.status === 'no-stream-playing') {
        // Handle no stream playing in channel - Wait for one to start
        return;
      } else if (response.status !== 'ok') {
        // Handle error
        return;
      }

      // Successfully subscribed to most recent channel presenter
      if (response.mediaStream) {
        // Do something with mediaStream
        setUserMessage(
          'joinChannel()::subscriberCallback(error, response) returned response.mediaStream.getStreamId()=' +
            response.mediaStream.getStreamId()
        );
      }

      if (response.renderer) {
        setStatusMessage('Subscribed');

        disposables.push(
          response.renderer.on('autoMuted', function handleAutoMuted() {
            // The browser refused to play video with audio therefore the stream was started muted.
            // Handle this case properly in your UI so that the user can unmute its stream

            setStatusMessage('Video was automatically muted');

            // Show button to unmute
            document.getElementById('unmuteButton').innerText = 'Unmute';
          })
        );

        disposables.push(
          response.renderer.on('failedToPlay', function handleFailedToPlay(reason) {
            // The browser refused to play video even with audio muted.
            // Handle this case properly in your UI so that the user can start their stream.

            setStatusMessage('Video failed to play: "' + reason + '"');

            if (isMobileAppleDevice && reason === 'failed-to-play') {
              // IOS battery saver mode requires user interaction with the <video> to play video
              videoElement.onplay = function () {
                setStatusMessage('Video play()');
                response.renderer.start(videoElement);
                videoElement.onplay = null;
              };
            } else {
              document.getElementById('playButton').onclick = function () {
                setStatusMessage('User triggered play()');
                response.renderer.start(videoElement);
              };
            }
          })
        );

        disposables.push(
          response.renderer.on('ended', function handleEnded(reason) {
            setStatusMessage('Video ended: "' + reason + '"');

            document.getElementById('playButton').onclick = function () {
              setStatusMessage('User triggered play()');
              joinChannel();
              // document.getElementById('playButton').style.display = 'none';
            };
            // document.getElementById('playButton').style.display = '';
          })
        );
      }
    }
  );
}

function setUserMessage(message) {
  var userMessageElement = document.getElementById('userMessage');

  userMessageElement.innerText = message;
}

function setStatusMessage(message) {
  var statusMessageElement = document.getElementById('statusMessage');

  statusMessageElement.innerText = message;
}

// FLOWICS CONFIG //

function onGraphicsLoad(flowicsGraphicsOutput) {
  console.log('Flowics Overlay: onGraphicsLoad Called');

  flowicsGraphicsOutput.show();
}

var flowicsGraphicsOutput = new Flowics.GraphicsOutput({
  syncGraphics: false,
  delay: 0,
  graphicsUrl: flowicsGraphicsUrl,
  className: `flowics-iframe`,
  onGraphicsLoad: onGraphicsLoad,
  domId: 'flowics-graphics',
});

/*
 * Listening to `NodeMessage` events.
 *
 * A `NodeMessage` event is sent when a Node (Text, Container, Image) from the
 * Graphics is configured to trigger a `Send Message` action as a result of
 * a user action (for ex. click/tap on the node).
 * When defining a `Send Message` action, the graphics author configures the message to be sent.
 * This message is a string.
 * You can send for example a plain text message or a serialized JSON.
 * It's important that the receiving app handles the messages accordingly to how they are
 * configured.
 *
 * `NodeMessage` events have the following interface
 *
 *   interface NodeMessageEvent {
 *     type: 'NodeMessage';
 *     message: string;
 *   }
 *
 *   An example event transporting the `Hello world` plain text is
 *   {
 *     type: 'NodeMessage',
 *     message: 'Hello world'
 *   }
 *
 *   An example event transporting a serialized JSON is
 *   {
 *     type: 'NodeMessage',
 *     message: '{"type": "buy", "product": "A0001"}'
 *   }
 *
 *  To be able to get these messages a listener can be registered as shown in the following code
 *  showing how a serialized JSON that is sent from the graphics can be handled.
 */

const parseAndLogNodeMessage = (event) => {
  try {
    console.log('Parsed Message', JSON.parse(event.message));
  } catch (e) {
    console.error('Failed to Parse Message as JSON. Event: ', event);
  }
};

const logEvent = (eventType) => (event) => {
  console.log(eventType, event);
};
const logNodeMessage = logEvent('NodeMessage');

flowicsGraphicsOutput.on('NodeMessage', logNodeMessage);
flowicsGraphicsOutput.on('NodeMessage', parseAndLogNodeMessage);
/* To deregister the listener the `off` method can be used
 *
 * flowicsGraphicsOutput.off('NodeMessage', logNodeMessage);
 * flowicsGraphicsOutput.off('NodeMessage', parseAndLogNodeMessage);
 */

const player = document.querySelector('#customPlayer');
const fsButton = document.querySelector('#fullscreen');
const pauseButton = document.querySelector('#pauseButton');
const playButton = document.querySelector('#playButton');
const muteToggleButton = document.querySelector('#muteToggleButton');

fsButton.addEventListener('click', (ev) => {
  toggleFullscreen();
});

function exitFullscreenHandler() {
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    player.classList.remove('fullscreen');
  }
}

function toggleFullscreen() {
  const requestFullscreen =
    player.requestFullscreen || player.webkitRequestFullScreen || player.mozRequestFullscreen;

  if (requestFullscreen) {
    if (!document.fullscreenElement) {
      requestFullscreen
        .call(player)
        .then(() => {
          player.classList.add('fullscreen');
        })
        .catch((err) => {
          console.err(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
      document.exitFullscreen();
      player.classList.remove('fullscreen');
    }
  } else {
    // Manually make fullscreen
    player.classList.toggle('iph-fs');
  }
}

document.addEventListener('fullscreenchange', exitFullscreenHandler);

pauseButton.addEventListener('click', (ev) => {
  videoElement.pause();
  flowicsGraphicsOutput.hide();
});

playButton.addEventListener('click', (ev) => {
  videoElement.play();
  flowicsGraphicsOutput.show();
});

// END FLOWICS //

muteToggleButton.onclick = function () {
  videoElement.muted = !videoElement.muted;
  muteToggleButton.innerText = videoElement.muted ? 'Unmute' : 'Mute';
  // setStatusMessage('');
};

// Mobile devices only support autoplay with WebRTC. In order to autoplay with 'streaming' (not real-time) you need to mute the video element
if ((isMobileAppleDevice || isOtherMobile) && !sdk.RTC.webrtcSupported) {
  videoElement.muted = true;

  // Show button to unmute
  muteToggleButton.innerText = 'Unmute';
} else {
  muteToggleButton.innerText = 'Mute';
}

// Join and view the channel
joinChannel();
