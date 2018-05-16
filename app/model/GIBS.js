Ext.define('Ripples.model.GIBS', {
  extend: 'Ripples.model.Base',

  fields: [
    {
      name: 'day',
      type: 'string',
    }
  ],

  proxy: {
    url: '/resources/json/gibs.json'
  }
});