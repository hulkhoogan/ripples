Ext.define('Ripples.view.home.components.Map', {
  extend: 'Ext.ux.LeafletMap',
  alias: 'widget.mapleaflet',

  config: {
    baseLayers: {
      'Open Street Map': 'osmLayer',
      'Grayscale': 'streets',
      'Terrain': 'hybrid',
      'Outdoors': 'ThunderForest1',
      'ESRI Ocean': 'Esri_OceanBasemap',
      'ESRI Aerial': 'Esri_WorldImagery'
    },
    overlays: {
      'Nautical Charts': 'transasLayer',
      'KML Layer': 'kmlLayer',
      'Ship Traffic': 'densityLayer'
    },
    originLat: 41.184774,
    originLng: -8.704476,
    originZoom: 12,

    activeLayers: ['osmLayer']
  },

  useLocation: false,
  autoCenter: false,
  enableOwnPositionMarker: false,
  mapOptions: {
    zoom: 12,
    center: [41.184774, -8.704476],
    zoomSnap: 0.25,
    contextmenu: true,
    drawControl: true,
    measureControl: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
      text: 'Show coordinates',
      callback: 'showCoordinates'
    }, {
      text: 'Center map here',
      callback: 'centerMap'
    }]
  },

  showCoordinates: function () {

  },

  centerMap: function () {

  },

  initPlugins: function () {
    var map = this.getMap(),
      mouse_coordinates = new L.control.coordinates({
        position: 'topleft',
        labelTemplateLat: 'Lat: {y}',
        labelTemplateLng: 'Lng: {x}',
        useLatLngOrder: true
      });
    map.addControl(mouse_coordinates);

    L.control.locate({
      keepCurrentZoomLevel: true,
      stopFollowingOnDrag: true,
      icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
      iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
      metric: true,  // use metric or imperial units
      onLocationError: function (err) {alert(err.message);},  // define an error callback function
      onLocationOutsideMapBounds: function (context) { // called when outside map boundaries
        alert(context.options.strings.outsideMapBoundsMsg);
      }
    }).addTo(map);
  },

  listeners: {
    maprender: function (panel, map, layers) {
      this.initPlugins();
    }
  }
});

/**
 * TODO
 *
 * afterRender
 if (isMobile.any()) {
	//alert('Mobile');
	L.control.layers(baseLayers, overlays).addTo(map);
} else {
	//alert('PC');
	//L.control.weather().addTo(map);
	L.control.layers.minimap(baseLayers, overlays).addTo(map);
	var mouse_coordinates = new L.control.coordinates({
		position:"topleft",
		labelTemplateLat:"Lat: {y}",
		labelTemplateLng:"Lng: {x}",
		useLatLngOrder:true
	});
	map.addControl(mouse_coordinates);
}
 */