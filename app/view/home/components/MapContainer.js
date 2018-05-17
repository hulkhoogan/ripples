Ext.define('Ripples.view.home.components.MapContainer', {
  extend: 'Ext.panel.Panel',

  alias: 'widget.mapcontainer',

  requires: [
    'Ext.button.Button',
    'Ext.container.Container',
    'Ext.layout.container.Card',
    'Ext.layout.container.HBox',
    'Ext.panel.Panel',
    'Ripples.view.home.components.Map'
  ],

  layout: 'hbox',

  config: {
    window: null
  },

  items: [{
    xtype: 'panel',
    width: 50,
    height: '100%',
    items: [{
      xtype: 'button',
      iconCls: 'x-fa fa-map',
      handler: 'gibsMaps'
    }, {
      xtype: 'button',
      iconCls: 'x-fa fa-refresh',
      handler: 'invalidateSize'
    }],
    defaults: {
      width: 50,
      height: 50
    }
  }, {
    xtype: 'container',
    layout: 'card',
    flex: 1,
    height: '100%',
    items: [{
      xtype: 'mapleaflet',
      width: '100%',
      height: '100%',
      listeners: {
        'mousemove': 'onMouseMove'
      }
    }]
  }]
});