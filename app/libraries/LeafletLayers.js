Ext.define('Ripples.libraries.LeafletLayers', {

  layers: [{
    itemId: 'kmlLayer',
    url: Ext.getResourcePath('kml/file.kmz'),
    type: 'KML',
    options: {
      async: true
    }
  }, {
    itemId: 'transasLayer',
    url: 'http://wms.transas.com/TMS/1.0.0/TX97-transp/{z}/{x}/{y}.png?token=9e53bcb2-01d0-46cb-8aff-512e681185a4',
    type: 'tileLayer',
    options: {
      attribution: 'Map data &copy; Transas Nautical Charts',
      maxZoom: 21,
      opacity: 0.7,
      maxNativeZoom: 17,
      tms: true
    }
  }, {
    itemId: 'densityLayer',
    url: 'https://tiles2.marinetraffic.com/ais/density_tiles2015/{z}/{x}/tile_{z}_{x}_{y}.png',
    type: 'tileLayer',
    options: {
      attribution: 'Map data &copy; MarineTraffic',
      maxZoom: 21,
      opacity: 0.5,
      maxNativeZoom: 10,
      layerVisibility: false
    }
  }],

  getLayerById: function (itemId) {
    var layer = null;
    this.layers.forEach(function (item) {
      if (item.itemId === itemId) {
        layer = item;
      }
    }.bind(this));
    if (layer) {
      var leafletLayer;
\      switch (layer.type) {
        case 'KML':
          leafletLayer = new L.KML(layer.url, layer.options);
          break;
        case 'tileLayer':
          leafletLayer = new L.tileLayer(layer.url, layer.options);
          break;
        default: {}
      }
      return leafletLayer;
    } else {
      console.error('Unknown layer \'' + itemId + '\'.');
    }
  }
});