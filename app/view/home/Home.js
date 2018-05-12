Ext.define('Ripples.view.home.Home', {
  extend: 'Ext.Container',

  requires: [
    'Ext.button.Split',
    'Ext.container.Container',
    'Ext.form.Label',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'Ext.toolbar.Fill',
    'Ext.toolbar.Toolbar',
    'Ext.ux.LeafletMap',
    'Ripples.view.home.HomeController',
    'Ripples.view.home.HomeModel',
    'Ripples.view.home.components.Map',
    'Ripples.view.home.components.MapContainer'
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
    xtype: 'toolbar',
    height: 40,
    width: '100%',
    style: 'background: #252432',
    items: [{
      xtype: 'label',
      text: 'RIPPLES',
      cls: 'logo'
    }, '->', {
      xtype: 'splitbutton',
      height: 30,
      text: 'Maps',
      menu: [{
        text: 'Map 1',
        name: 'map1',
        handler: 'toogleMap'
      }, {
        text: 'Map 2',
        name: 'map2',
        handler: 'toogleMap'
      }, {
        text: 'Map 3',
        name: 'map3',
        handler: 'toogleMap'
      }, {
        text: 'Map 4',
        name: 'map4',
        handler: 'toogleMap'
      }]
    }]
  }, {
    xtype: 'container',
    flex: 1,
    width: '100%',
    layout: 'hbox',
    items: [{
      flex: 1,
      itemId: 'map1',
      height: '100%',
      hidden: false,
      xtype: 'mapcontainer'
    }, {
      flex: 1,
      itemId: 'map2',
      height: '100%',
      hidden: true,
      xtype: 'mapcontainer'
    }]
  }, {
    xtype: 'container',
    flex: 1,
    width: '100%',
    hidden: true,
    layout: 'hbox',
    activeItems: 0,
    items: [{
      flex: 1,
      height: '100%',
      itemId: 'map3',
      hidden: true,
      xtype: 'mapcontainer'
    }, {
      flex: 1,
      itemId: 'map4',
      height: '100%',
      hidden: true,
      xtype: 'mapcontainer'
    }]
  }]
});