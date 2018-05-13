Ext.define('Ripples.model.Active', {
  extend: 'Ripples.model.Base',

  proxy: {
    url: 'http://ripples.lsts.pt/api/v1/systems/active'
  }
});