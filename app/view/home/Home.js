Ext.define('Ripples.view.home.Home', {
  extend: 'Ext.Container',

  requires: [
    'Ext.layout.container.Fit',
    'Ext.ux.LeafletMap',
    'Ripples.view.home.HomeController',
    'Ripples.view.home.HomeModel',
    'Ripples.view.home.components.Map'
  ],

  alias: 'widget.home',

  viewModel: {
    type: 'home'
  },

  controller: 'home',

  width: '100%',
  height: '100%',
  items: [{
    xtype: 'mapleaflet'
  }],
  layout: 'fit'
});