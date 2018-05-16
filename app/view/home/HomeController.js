Ext.define('Ripples.view.home.HomeController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.home',

  mixins: [
    'Ripples.view.home.FireBase',
    'Ripples.libraries.LeafletIcons',
    'Ripples.view.home.StoresLoads',
    'Ext.chart.interactions.ItemHighlight'
  ],

  requires: [
    'Ext.chart.CartesianChart',
    'Ext.chart.axis.Category',
    'Ext.chart.axis.Numeric',
    'Ext.chart.series.Line',
    'Ext.data.ArrayStore',
    'Ext.data.JsonStore',
    'Ext.form.field.Date',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.grid.column.Check',
    'Ext.grid.column.Date',
    'Ext.grid.plugin.CellEditing',
    'Ext.layout.container.Fit',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.util.Format',
    'Ext.window.Window'
  ],

  init: function () {
    var model = this.getViewModel(),
      store = this.getStore('active'),
      storePositions = this.getStore('positions'),
      ripplesRef = new Firebase('https://neptus.firebaseio.com/'),
      me = this;

    me.getView().down('#map2').hide();
    me.getView().down('#map3').hide();
    me.getView().down('#map4').hide();
    me.getView().down('#map4').up().hide();

    model.get('activeMaps')['#map1'] = this.getView().down('#map1');
    model.set('maps', {
      '#map1': this.getView().down('#map1'),
      '#map2': this.getView().down('#map2'),
      '#map3': this.getView().down('#map3'),
      '#map4': this.getView().down('#map4')
    });
    this.crosshairIcon = L.icon({
      iconUrl: '/resources/images/crosshair.png',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    ripplesRef.child('assets').on('child_changed', this.updateAsset);
    ripplesRef.child('assets').on('value', this.updateAsset);
    ripplesRef.child('assets').on('child_added', this.updateAsset);
    ripplesRef.child('ships').on('child_changed', this.updateShip);
    ripplesRef.child('ships').on('child_added', this.updateShip);
    ripplesRef.child('ships').on('value', this.updateAsset);

    store.load();
    storePositions.load();

    Ext.global.setInterval(function () {
      store.load();
    }, 60000);
  },

  syncMaps: function (cmp) {
    let view = cmp.getView(),
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
      containerTop = (button.name === 'map1' || button.name === 'map2'),
      me = this,
      model = this.getViewModel();

    if (cmp.hidden) {
      cmp.show();
      model.get('activeMaps')[itemId] = cmp;
      if (container || containerTop) {
        var cmpContainer = cmp.up();
        cmpContainer.show();
        cmpContainer.activeItems = cmpContainer.activeItems + 1;
      }
    }
    else {
      cmp.hide();
      delete model.get('activeMaps')[itemId];
      if (container || containerTop) {
        var cmpContainer = cmp.up();
        cmpContainer.activeItems = cmpContainer.activeItems - 1;
        if (cmpContainer.activeItems === 0) {
          cmpContainer.hide();
        }
      }
    }
    Ext.defer(function () {me.syncMaps(me);}, 500);
  },

  onMouseMove: function (cmp, currentMap, ev) {
    var view = cmp,
      itemId = '#' + cmp.up('mapcontainer').getItemId(),
      model = this.getViewModel(),
      activeMaps = model.get('activeMaps'),
      me = this,
      crosshair = cmp.getCrosshair();
    if (crosshair) currentMap.removeLayer(crosshair);
    cmp.setCrosshair(null);

    Ext.iterate(activeMaps, function (key, value) {
      if (key !== itemId) {
        var map = value.down('leafletmap').getMap(),
          lat = ev.latlng.lat,
          lng = ev.latlng.lng,
          marker = new L.marker([lat, lng], {icon: me.crosshairIcon, clickable: false}),
          cmpMap = value.down('mapleaflet');
        if (cmpMap.getCrosshair()) {
          map.removeLayer(cmpMap.getCrosshair());
        }
        marker.addTo(map);
        cmpMap.setCrosshair(marker);
        map.coordinateControl._update(ev);
      }
    });

  },

  gibsMaps: function (button) {
    var gibsStore = this.getStore('gibs'),
      cmp = button.up('mapcontainer'),
      itemId = '#' + cmp.getItemId(),
      window = cmp.getWindow(),
      map = cmp.down('mapleaflet'),
      gibsLayers = map.getGibsLayers();
    gibsStore.clearFilter();

    if (window) {
      window.show();
    }
    else {
      var newWindow = Ext.create('Ext.window.Window', {
        title: 'Nasa GIBS Layers',
        height: 360,
        width: 360,
        layout: 'vbox',
        closeAction: 'hide',

        listeners: {
          show: function () {
            this.down('textfield').setValue('');
          }
        },
        items: [{
          xtype: 'textfield',
          width: '100%',
          height: 40,
          listeners: {
            change: function (cmp) {
              var text = cmp.getValue();
              gibsStore.filter('title', text);
            }
          }
        }, {
          xtype: 'grid',
          flex: 1,
          width: '100%',
          border: false,
          title: false,
          hideHeaders: true,

          plugins: [
            Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})
          ],
          selModel: {
            selType: 'checkboxmodel',
            checkOnly: true
          },
          columns: [{
            dataIndex: 'title',
            flex: 1
          }, {
            width: 130,
            editable: true,
            allowBlank: false,
            dataIndex: 'day',
            editor: {
              xtype: 'datefield',
              format: 'd-m-Y'
            },
            renderer: function (date) {
              if (date)
                return Ext.Date.format(new Date(date), 'd-m-Y');
              else
                return;
            }
          }],
          store: gibsStore,

          listeners: {
            select: function (view, record) {
              var data = record.getData(),
                now = new Date(),
                oneDay = 1000 * 60 * 60 * 24, // milliseconds in one day
                startTimestamp = now.getTime() - oneDay + now.getTimezoneOffset() * 60 * 1000 * 60 * 1000,
                startDate = new Date(startTimestamp);
              if (data.day) {
                startDate = (new Date(data.day));
              }

              var layer = new L.GIBSLayer(data.title, {
                date: startDate,
                transparent: false
              });
              gibsLayers[data.title] = layer;
              map.setGibsLayers(gibsLayers);
              map.getMap().addLayer(layer, true);
              layer.bringToFront();
            },
            deselect: function (view, record) {
              var data = record.getData(),
                layer = gibsLayers[data.title];
              if (layer) {
                map.getMap().removeLayer(layer);
                delete gibsLayers[data.title];
                map.setGibsLayers(gibsLayers);
              }
            }
          }
        }]
      }).show();
      cmp.setWindow(newWindow);
    }
  }

});