import './styles.css';

declare global {
  interface Window {
    Flowics: any;
    graphics: any;
  }
}

type GraphicsOverlay = any;

document.addEventListener('DOMContentLoaded', function (event) {
  function onGraphicsLoad(flowicsGraphicsOverlay: GraphicsOverlay) {
    console.log('Flowics Overlay: onGraphicsLoad Called');

    // Overrides some texts in the graphics
    flowicsGraphicsOverlay.show();
    flowicsGraphicsOverlay.setTexts({
      n12: 'Mataron a Kenny!',
    });
    window.graphics = flowicsGraphicsOverlay;
  }

  const flowicsGraphicsOverlay: GraphicsOverlay = new window.Flowics.GraphicsOverlay({
    graphicsUrl:
      'http://dev.flowics.com:5000/public/7f1abbadc05d2db270a52cad6360327b/60cbbd6efa3fb195af02fe13/live',
    className: `flowics-iframe`,
    onGraphicsLoad: onGraphicsLoad,
    domId: 'flowics-graphics',
  });
});
