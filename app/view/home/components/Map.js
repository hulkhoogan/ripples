Ext.define('Ripples.view.home.components.Map', {
  extend: 'Ext.ux.LeafletMap',
  alias: 'widget.mapleaflet',

  mixins: [
    'Ripples.libraries.LeafletBasemaps',
    'Ripples.libraries.LeafletLayers'
  ],

  config: {
    baseLayers: null,
    overlays: null,
    crosshair: null,

    mapOptions: {
      zoom: 5,
      center: [31.0, -130]
    },

    gibsLayers: {},

    markers: {},
    updates: {},
    tails: {},
    plans: {},
    etaMarkers: {},
    ships: {},

    activeLayer: 'ESRI Aerial',
    activeOverLay: 'KML Layer'
  },

  useLocation: false,
  autoCenter: false,
  enableOwnPositionMarker: false,
  mapOptions: {
    zoom: 5,
    center: [31.0, -130],
    zoomSnap: 0.25,
    contextmenu: true,
    drawControl: true,
    measureControl: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
      text: 'Show Coordinates',
      callback: function (e) {
        this.options.cmp.showCoordinates(e);
      }
    }, {
      text: 'Center Map',
      callback: function (e) {
        this.options.cmp.centerMap(e);
      }
    }, {
      text: 'Show GIBS Layers',
      callback: function (e) {
        this.options.cmp.toogleGibsLayer(e);
      }
    }]
  },

  showCoordinates: function (e) {
    var map = this.getMap(),
      mCoords = new L.marker(e.latlng).bindPopup('Lat: ' + e.latlng.lat + ' Lng:' + e.latlng.lng).addTo(map).openPopup();
    Ext.defer(function () {map.removeLayer(mCoords);}, 5000);
  },
  centerMap: function (e) {
    var map = this.getMap();
    map.panTo(e.latlng);
  },

  toogleGibsLayer: function () {
    var map = this.getMap();

  },

  setConfigs: function () {
    this.setBaseLayers({
      'Open Street Map': this.getBasemapById('osmLayer'),
      'Grayscale': this.getBasemapById('streets'),
      'Terrain': this.getBasemapById('hybrid'),
      'Outdoors': this.getBasemapById('thunderForest'),
      'ESRI Ocean': this.getBasemapById('oceanBasemap'),
      'ESRI Aerial': this.getBasemapById('worldImagery'),
      'GMRT': this.getBasemapById('gmrt')
    });
    this.setOverlays({
      'Nautical Charts': this.getLayerById('transasLayer'),
      'KML Layer': this.getLayerById('kmlLayer'),
      'Ship Traffic': this.getLayerById('densityLayer')
    });
  },

  initPlugins: function () {
    var map = this.getMap(),
      me = this,
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
      icon: 'fa fa-map-marker',
      iconLoading: 'fa fa-spinner fa-spin',
      metric: true,
      onLocationError: function (err) {alert(err.message);},
      onLocationOutsideMapBounds: function (context) {
        alert(context.options.strings.outsideMapBoundsMsg);
      }
    }).addTo(map);
    var overlays = this.getOverlays();

    this.setOverlays(overlays);

    L.control.layers(this.getBaseLayers(), this.getOverlays(), {autoZIndex: true}).addTo(map);

    if (this.getActiveLayer()) {
      map.addLayer(this.getBaseLayers()[this.getActiveLayer()]);
    }
    if (this.getActiveOverLay()) {
      map.addLayer(this.getOverlays()[this.getActiveOverLay()]);
    }

  },

  listeners: {
    maprender: function (panel, map, layers) {
      this.setConfigs();
      this.initPlugins();
    }
  }
});