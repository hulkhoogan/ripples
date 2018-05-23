Ext.define('Ripples.Application', {
  extend: 'Ext.app.Application',

  name: 'Ripples',

  quickTips: false,
  platformConfig: {
    desktop: {
      quickTips: true
    }
  },

  stores: [],

  launch: function () {
    // TODO - Launch the application
    Ext.getBody().mask('Loading');
  },

  onAppUpdate: function () {
    Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
      function (choice) {
        if (choice === 'yes') {
          window.location.reload();
        }
      }
    );
  }
});
