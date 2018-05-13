Ext.define('Ripples.model.Base', {
  extend: 'Ext.data.Model',

  requires: [
    'Ext.data.proxy.Ajax',
    'Ext.data.reader.Json'
  ],

  fields: [],

  schema: {
    namespace: 'Ripples.model',

    proxy: {
      type: 'ajax',
      url: 'http://ripples.lsts.pt/api/v1/{entityName:lowercase}',
      reader: {
        type: 'json'
      }
    }
  }
});