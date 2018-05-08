Ext.define('Ripples.view.home.HomeController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.home',

  config: {
    refs: {
      mapCmp: '#leafletmap'
    },
    control: {
      mapCmp: {
        maprender: 'onMapRender',
        zoomend: 'onZoomEnd',
        movestart: 'onMoveStart',
        moveend: 'onMoveEnd'
      }
    }
  },

  onMapRender: function (component, map, layer) {
    console.log('map render');
  },
  onZoomEnd: function (component, map, layer, zoom) {
    console.log('zoom end -> new zoom level: ' + zoom);
  },
  onMoveStart: function (component, map, layer) {
    console.log('move start');
  },
  onMoveEnd: function (component, map, layer) {
    console.log('move end');
  }
});