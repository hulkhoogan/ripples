Ext.define('Ripples.view.home.components.Map', {
  extend: 'Ext.ux.LeafletMap',
  alias: 'widget.mapleaflet',

  useLocation: true,
  autoCenter: true,
  enableOwnPositionMarker: false,
  mapOptions: {
    zoom: 10,
    zoomSnap: 0.25,
    contextmenu: true,
    drawControl: true,
    measureControl: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
      text: 'Show coordinates',
      // callback: showCoordinates
    }, {
      text: 'Center map here',
      // callback: centerMap
    }]
  }

//
//
//   var baseLayers = {
//     "Open Street Map" : osmLayer,
//     "Grayscale" : streets,
//     "Terrain" : hybrid,
//     "Outdoors" : ThunderForest1,
//     "ESRI Ocean" : Esri_OceanBasemap,
//     "ESRI Aerial" : Esri_WorldImagery
//   };
//
// var overlays = {
//   "Nautical Charts" : transasLayer,
//   "KML Layer": kmlLayer,
//   "Ship Traffic": densityLayer
// }
});