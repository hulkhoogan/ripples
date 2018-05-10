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
    originLat: 41.184774,
    originLng: -8.704476,
    originZoom: 12,

    activeLayer: 'Open Street Map',
    activeOverLay: 'Nautical Charts'
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
      'Ship Traffic': this.getLayerById('densityLayer'),
      'MODIS_Terra_CorrectedReflectance_TrueColor': this.getLayerById('MODIS_Terra_CorrectedReflectance_TrueColor'),
      'GHRSST_L4_MUR_Sea_Surface_Temperature': this.getLayerById('GHRSST_L4_MUR_Sea_Surface_Temperature'),
      'MODIS_Terra_Sea_Ice': this.getLayerById('MODIS_Terra_Sea_Ice'),
      'AMSR2_Wind_Speed_Day': this.getLayerById('AMSR2_Wind_Speed_Day'),
      'MODIS_Terra_Cloud_Top_Pressure_Day': this.getLayerById('MODIS_Terra_Cloud_Top_Pressure_Day'),
      'AMSR2_Surface_Precipitation_Rate_Day': this.getLayerById('AMSR2_Surface_Precipitation_Rate_Day'),
      'MODIS_Terra_Chlorophyll_A': this.getLayerById('MODIS_Terra_Chlorophyll_A')
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
    var now = new Date();

    var oneDay = 1000 * 60 * 60 * 24,
      startTimestamp = now.getTime() - oneDay + now.getTimezoneOffset() * 60 * 1000,
      startDate = new Date(startTimestamp); //previous day
    var overlays = this.getOverlays();
    for (var id in L.GIBS_LAYERS) {
      overlays[id] = new L.GIBSLayer(id, {date: startDate, transparent: true});
    }
    this.setOverlays(overlays);
    // L.control.layers(baseLayers, null, {collapsed: false}).addTo(map);

    L.control.layers(this.getBaseLayers(), this.getOverlays(), {autoZIndex: false}).addTo(map);

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