Ext.define('Ripples.view.home.Home', {
  extend: 'Ext.Container',

  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
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
  layout: 'vbox',

  items: [{
    xtype: 'container',
    flex: 1,
    width: '100%',
    layout: 'hbox',
    items: [{
      flex: 1,
      height: '100%',
      xtype: 'mapleaflet'
    }, {
      flex: 1,
      height: '100%',
      xtype: 'mapleaflet'
    }]
  }, {
    xtype: 'container',
    flex: 1,
    width: '100%',
    layout: 'hbox',
    items: [{
      flex: 1,
      height: '100%',
      xtype: 'mapleaflet'
    }, {
      flex: 1,
      height: '100%',
      xtype: 'mapleaflet'
    }]
  }]
});