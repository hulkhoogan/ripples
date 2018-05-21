Ext.define('Ripples.view.home.HomeModel', {
  extend: 'Ext.app.ViewModel',
  alias: 'viewmodel.home',

  requires: [
    'Ripples.model.GIBS'
  ],

  stores: {
    active: {
      model: 'Active',
      autoLoad: false,
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
      pageSize: 1000,
      autoLoad: false,
      listeners: {
        load: 'positionsLoad'
      }
    },

    gibs: {
      model: 'GIBS',
      autoLoad: true
    },

    profiles: {
      model: 'Profiles',
      autoLoad: false,

      listeners: {
        load: 'profilesLoad'
      }
    },

    plans: {
      model: 'Soi',
      autoLoad: false,
      listeners: {
        load: 'plansLoad'
      }
    }
  },

  data: {
    activeMaps: {},
    maps: {}
  }
});