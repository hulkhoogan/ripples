Ext.define('Ripples.libraries.LeafletBasemaps', {

  basemaps: [{
    itemId: 'hybrid',
    type: 'TileLayer',
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      name: 'Hybrid',
      attribution: 'Map data &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
      maxZoom: 16
    }
  }, {
    itemId: 'streets',
    type: 'TileLayer',
    url: 'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
    options: {
      name: 'Streets',
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
      maxZoom: 18
    }
  }, {
    itemId: 'oceanBasemap',
    type: 'TileLayer',
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
    options: {
      name: 'Esri_OceanBasemap',
      attribution: 'Tiles &copy; ESRI',
      maxZoom: 13
    }
  }, {
    itemId: 'worldImagery',
    type: 'TileLayer',
    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    options: {
      name: 'Esri_WorldImagery',
      attribution: 'Tiles &copy; ESRI'
    }
  }, {
    itemId: 'thunderForest',
    type: 'TileLayer',
    url: 'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=c4d207cad22c4f65b9adb1adbbaef141',
    options: {
      name: 'ThunderForest1',
      attribution: 'Tiles &copy; ThunderForest'
    }
  }, {
    itemId: 'osmLayer',
    type: 'TileLayer',
    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution: 'Map data &copy; OpenStreetMap contributors, CC-BY-SA',
      maxZoom: 23
    }
  }, {
    itemId: 'gmrt',
    type: 'wms',
    url: 'https://www.gmrt.org/services/mapserver/wms_merc?service=WMS&version=1.0.0&request=GetMap',
    options: {
      layers: 'gmrt',
      attribution: 'GEBCO (multiple sources)'
    }
  }],

  getBasemapById: function (itemId) {
    var basemap = null;
    this.basemaps.forEach(function (item) {
      if (item.itemId === itemId) {
        basemap = item;
      }
    }.bind(this));
    if (basemap) {
      var leafletBasemap;
      switch (basemap.type) {
        case 'TileLayer':
          leafletBasemap = new L.TileLayer(basemap.url, basemap.options);
          break;
        case 'wms':
          leafletBasemap = new L.tileLayer.wms(basemap.url, basemap.options);
          break;
        default: {}
      }
      return leafletBasemap;
    } else {
      console.error('Unknown basemap \'' + itemId + '\'.');
    }
  }

});