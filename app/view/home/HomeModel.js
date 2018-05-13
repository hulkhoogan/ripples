Ext.define('Ripples.view.home.HomeModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.home',

  requires: [
    'Ripples.model.GIBS'
  ],

  stores: {
    active: {
      model: 'Active',
      autoLoad: true,
      listeners: {
        load: 'activeLoad'
      }
    },
    systems: {
      model: 'Systems',
      autoLoad: true
    },

    positions: {
      model: 'Positions',
      autoLoad: true,
      listeners: {
        load: 'positionsLoad'
      }
    },

    gibs: {
      model: 'GIBS',
      autoLoad: true
    }
  },

  data: {
    activeMaps: {}
  }
});