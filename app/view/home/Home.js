Ext.define('Ripples.view.home.Home', {
  extend: 'Ext.Container',

  requires: [
    'Ext.layout.container.Fit',
    'Ext.ux.LeafletMap',
    'Ripples.view.home.HomeController',
    'Ripples.view.home.HomeModel'
  ],

  alias: 'widget.home',

  viewModel: {
    type: 'home'
  },

  controller: 'home',

  width: '100%',
  height: '100%',
  layout: 'fit',
  items: [{
    xtype: 'leafletmap',
    id: 'map1',
    useLocation: true,
    autoCenter: true,
    enableOwnPositionMarker: false,
    mapOptions: {
      zoom: 14
    }
  }]
});