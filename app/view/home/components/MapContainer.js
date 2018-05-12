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

  items: [{
    xtype: 'panel',
    width: 50,
    height: '100%',
    items: [{
      xtype: 'button',
      text: 'BaseMaps'
    }, {
      xtype: 'button',
      text: 'Overlays'
    }, {
      xtype: 'button',
      text: 'GIBS'
    }, {
      xtype: 'button',
      text: 'invalidate size'
    }, {
      xtype: 'button',
      text: 'Teste'
    }, {
      xtype: 'button',
      text: 'Teste'
    }, {
      xtype: 'button',
      text: 'Teste'
    }]
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
        'mousemove': function () {
          console.log('a');
        }
      }
    }]
  }]
});