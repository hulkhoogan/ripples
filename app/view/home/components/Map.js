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
      'ESRI Aerial': this.getBasemapById('worldImagery')
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
      icon: 'fa fa-map-marker',  // class for icon, fa-location-arrow or fa-map-marker
      iconLoading: 'fa fa-spinner fa-spin',  // class for loading icon
      metric: true,  // use metric or imperial units
      onLocationError: function (err) {alert(err.message);},  // define an error callback function
      onLocationOutsideMapBounds: function (context) { // called when outside map boundaries
        alert(context.options.strings.outsideMapBoundsMsg);
      }
    }).addTo(map);

    L.control.layers.minimap(this.getBaseLayers(), this.getOverlays()).addTo(map);

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
      var template =
        '//map1{s}.vis.earthdata.nasa.gov/wmts-webmerc/' +
        '{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.{format}';

      var MODIS_Terra_CorrectedReflectance_TrueColor = L.tileLayer(template, {
        layer: 'MODIS_Terra_CorrectedReflectance_TrueColor',
        tileMatrixSet: 'GoogleMapsCompatible_Level9',
        maxZoom: 9,
        time: '2013-11-04',
        tileSize: 256,
        opacity: 0.8,
        subdomains: 'abc',
        format: 'jpeg',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975]
        ]
      });

      var GHRSST_L4_MUR_Sea_Surface_Temperature = L.tileLayer(template, {
        layer: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
        tileMatrixSet: 'GoogleMapsCompatible_Level7',
        maxZoom: 7,
        time: '2018-05-08',
        tileSize: 256,
        opacity: 0.8,
        format: 'png',
        subdomains: 'abc',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975]
        ]
        // ,
        // crs: L.CRS.EPSG900913
      });
      var MODIS_Terra_Sea_Ice = L.tileLayer(template, {
        layer: 'MODIS_Terra_Sea_Ice',
        tileMatrixSet: 'GoogleMapsCompatible_Level7',
        maxZoom: 7,
        time: '2013-11-04',
        tileSize: 256,
        opacity: 0.8,
        format: 'png',
        subdomains: 'abc',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975]
        ]
      });
      var AMSR2_Wind_Speed_Day = L.tileLayer(template, {
        layer: 'AMSR2_Wind_Speed_Day',
        tileMatrixSet: 'GoogleMapsCompatible_Level6',
        maxZoom: 6,
        time: '2013-11-04',
        tileSize: 256,
        opacity: 0.8,
        format: 'png',
        subdomains: 'abc',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975]
        ]
      });

      var MODIS_Terra_Cloud_Top_Pressure_Day = L.tileLayer(template, {
        layer: 'MODIS_Terra_Cloud_Top_Pressure_Day',
        tileMatrixSet: 'GoogleMapsCompatible_Level6',
        maxZoom: 6,
        time: '2013-11-04',
        tileSize: 256,
        opacity: 0.8,
        format: 'png',
        subdomains: 'abc',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975]
        ]
      });

      var AMSR2_Surface_Precipitation_Rate_Day = L.tileLayer(template, {
        layer: 'AMSR2_Surface_Precipitation_Rate_Day',
        tileMatrixSet: 'GoogleMapsCompatible_Level6',
        maxZoom: 6,
        time: '2013-11-04',
        tileSize: 256,
        opacity: 0.8,
        format: 'png',
        subdomains: 'abc',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975]
        ]
      });

      var MODIS_Terra_Chlorophyll_A = L.tileLayer(template, {
        layer: 'MODIS_Terra_Chlorophyll_A',
        tileMatrixSet: 'GoogleMapsCompatible_Level7',
        maxZoom: 7,
        time: '2013-11-04',
        tileSize: 256,
        opacity: 0.8,
        format: 'png',
        subdomains: 'abc',
        bounds: [
          [-85.0511287776, -179.999999975],
          [85.0511287776, 179.999999975]
        ]
      });

      map.addLayer(GHRSST_L4_MUR_Sea_Surface_Temperature);
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