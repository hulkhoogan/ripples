Ext.define('Ripples.libraries.LeafletLayers', {

  layers: [{
    itemId: 'kmlLayer',
    url: 'http://ripples.lsts.pt/kml/file.kmz',
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
  }, {
    itemId: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    type: 'nasatileLayer',
    options: {
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
    }
  }, {
    itemId: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
    type: 'nasatileLayer',
    options: {
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
    }
  }, {
    itemId: 'MODIS_Terra_Sea_Ice',
    type: 'nasatileLayer',
    options: {
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
    }
  }, {
    itemId: 'AMSR2_Wind_Speed_Day',
    type: 'nasatileLayer',
    options: {
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
    }
  }, {
    itemId: 'MODIS_Terra_Cloud_Top_Pressure_Day',
    type: 'nasatileLayer',
    options: {
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
    }
  }, {
    itemId: 'AMSR2_Surface_Precipitation_Rate_Day',
    type: 'nasatileLayer',
    options: {
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
    }
  }, {
    itemId: 'MODIS_Terra_Chlorophyll_A',
    type: 'nasatileLayer',
    options: {
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
      switch (layer.type) {
        case 'KML':
          leafletLayer = new L.KML(layer.url, layer.options);
          break;
        case 'tileLayer':
          leafletLayer = new L.tileLayer(layer.url, layer.options);
          break;
        case 'nasatileLayer':
          var template =
            '//map1{s}.vis.earthdata.nasa.gov/wmts-webmerc/' +
            '{layer}/default/{time}/{tileMatrixSet}/{z}/{y}/{x}.{format}';
          leafletLayer = new L.tileLayer(template, layer.options);
          break;
        default: {}
      }
      return leafletLayer;
    } else {
      console.error('Unknown layer \'' + itemId + '\'.');
    }
  }
});