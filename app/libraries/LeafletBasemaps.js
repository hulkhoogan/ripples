Ext.define('Ripples.libraries.LeafletBasemaps', {

  /**
   * TODO
   * merge with layers
   */
  basemaps: [{
    itemId: 'hybrid',
    name: 'Hybrid',
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Map data &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
    maxZoom: 16
  }, {
    itemId: 'streets',
    name: 'Streets',
    url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
  }, {
    itemId: 'oceanBasemap',
    name: 'Esri_OceanBasemap',
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; ESRI',
    maxZoom: 13
  }, {
    itemId: 'worldImagery',
    name: 'Esri_WorldImagery',
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; ESRI',
    maxZoom: null
  }, {
    itemId: 'thunderForest',
    name: 'ThunderForest1',
    url: 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=c4d207cad22c4f65b9adb1adbbaef141',
    attribution: 'Tiles &copy; ThunderForest',
    maxZoom: null
  }, {
    itemId: 'osmLayer',
    name: 'osmLayer',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA',
    maxZoom: 23
  }],

  getBasemapById: function (itemId) {
    var basemap = null;
    this.basemaps.forEach(function (item) {
      if (item.itemId === itemId) {
        basemap = item;
      }
    }.bind(this));
    if (basemap) {
      return basemap;
    } else {
      console.error('Unknown basemap \'' + itemId + '\'.');
    }
  }

});