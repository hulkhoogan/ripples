Ext.define('Ripples.model.Profiles', {
  extend: 'Ripples.model.Base',

  proxy: {
    url: '/resources/json/tempProfiles.json'
  },

  idProperty: 'source'

});