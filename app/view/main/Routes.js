Ext.define('Ripples.view.main.Routes', {
  extend: 'Ext.app.ViewController',

  alias: 'controller.routes',

  onItemSelected: function (sender, record) {
    Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
  },

  onConfirm: function (choice) {
    if (choice === 'yes') {
      //
    }
  }
});
