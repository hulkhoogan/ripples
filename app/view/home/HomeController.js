Ext.define('Ripples.view.home.HomeController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.home',

  init: function () {
    var model = this.getViewModel();
    model.get('activeMaps')['#map1'] = this.getView().down('#map1');
  },

  syncMaps: function (cmp) {
    var view = cmp.getView(),
      model = this.getViewModel(),
      activeMaps = model.get('activeMaps'),
      count = 0;

    Ext.iterate(activeMaps, function (key, value) {
      value.down('leafletmap').getMap().invalidateSize();
      count++;
    });

    if (count > 1) {
      Ext.iterate(activeMaps, function (idA, mapA) {
        mapA = mapA.down('leafletmap').getMap();
        Ext.iterate(activeMaps, function (idB, mapB) {
          mapB = mapB.down('leafletmap').getMap();
          if (idA !== idB) {
            mapA.sync(mapB);
          }
        });
      });
    }

  },

  toogleMap: function (button) {
    var itemId = '#' + button.name,
      cmp = this.getView().down(itemId),
      container = (button.name === 'map3' || button.name === 'map4'),
      me = this,
      model = this.getViewModel();

    if (cmp.hidden) {
      cmp.show();
      model.get('activeMaps')[itemId] = cmp;
      if (container) {
        var cmpContainer = cmp.up();
        cmpContainer.show();
        cmpContainer.activeItems = cmpContainer.activeItems + 1;
      }
    }
    else {
      cmp.hide();
      delete model.get('activeMaps')[itemId];
      if (container) {
        var cmpContainer = cmp.up();
        cmpContainer.activeItems = cmpContainer.activeItems - 1;
        if (cmpContainer.activeItems === 0) {
          cmpContainer.hide();
        }
      }
    }
    Ext.defer(function () {me.syncMaps(me);}, 500);
  }
});