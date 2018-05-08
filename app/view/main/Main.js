Ext.define('Ripples.view.main.Main', {
  extend: 'Ext.container.Viewport',
  xtype: 'app-main',

  requires: [
    'Ext.layout.container.Fit',
    'Ext.layout.container.boxOverflow.None',
    'Ext.plugin.Responsive',
    'Ext.plugin.Viewport',
    'Ext.window.MessageBox',
    'Ripples.view.home.Home',
    'Ripples.view.main.Data',
    'Ripples.view.main.Routes'
  ],

  controller: 'routes',
  viewModel: 'data',

  width: '100%',
  height: '100%',

  layout: 'fit',

  items: {
    xtype: 'home'
  }

});
