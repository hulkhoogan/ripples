Ext.define('Ripples.model.Profiles', {
  extend: 'Ripples.model.Base',

  proxy: {
    // url: '/resources/json/tempProfiles.json'
    url: 'http://ripples.lsts.pt/soi/profiles'
  },

  idProperty: 'source'

});