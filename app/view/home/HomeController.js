Ext.define('Ripples.view.home.HomeController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.home',

  mixins: [
    'Ripples.libraries.LeafletIcons',
    'Ext.chart.interactions.ItemHighlight'
  ],

  requires: [
    'Ext.chart.CartesianChart',
    'Ext.chart.axis.Category',
    'Ext.chart.axis.Numeric',
    'Ext.chart.series.Line',
    'Ext.data.ArrayStore',
    'Ext.data.JsonStore',
    'Ext.form.field.Text',
    'Ext.grid.Panel',
    'Ext.grid.column.Check',
    'Ext.layout.container.Fit',
    'Ext.layout.container.VBox',
    'Ext.panel.Panel',
    'Ext.window.Window'
  ],

  init: function () {
    var model = this.getViewModel(),
      store = this.getStore('active');
    model.get('activeMaps')['#map1'] = this.getView().down('#map1');
    this.crosshairIcon = L.icon({
      iconUrl: '/resources/images/crosshair.png',
      iconSize: [20, 20], // size of the icon
      iconAnchor: [10, 10] // point of the icon which will correspond to marker's location
    });
    Ext.global.setInterval(function () {
      store.load();
    }, 60000);
  },

  syncMaps: function (cmp) {
    var view = cmp.getView(),
      model = this.getViewModel(),
      activeMaps = model.get('activeMaps'),
      count = 0,
      store = this.getStore('active'),
      storePositions = this.getStore('positions');

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
    this.activeLoad(store, store.getData().items);
    this.positionsLoad(storePositions, storePositions.getData().items);

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

  activeLoad: function (store, recs) {
    var me = this,
      model = this.getViewModel(),
      activeMaps = model.get('activeMaps'),
      profiles = this.getStore('profiles');

    recs.forEach(function (element, index, array) {
      var data = element.getData(),
        coords = data.coordinates,
        name = data.name,
        updated = new Date(data.updated_at),
        ic = me.getIconByImcid(data.imcid),
        mins = (new Date() - updated) / 1000 / 60,
        ellapsed = Math.floor(mins) + ' mins ago';

      if (mins > 120) {
        ellapsed = Math.floor(mins / 60) + ' hours ago';
      }
      if (mins > 60 * 24 * 2) {
        ellapsed = Math.floor(mins / 60 / 24) + ' days ago';
      }
      Ext.iterate(activeMaps, function (key, value) {
        var map = value.down('leafletmap').getMap(),
          cmp = value.down('leafletmap'),
          markers = cmp.getMarkers(),
          updates = cmp.getUpdates();
        if (markers[name] == undefined) {
          updates[name] = updated;
          markers[name] = L.marker(coords, {
            icon: ic
          });
          markers[name].bindPopup('<b>' + name + '</b><br/>'
            + coords[0].toFixed(6) + ', '
            + coords[1].toFixed(6) + '<hr/>'
            + updated.toLocaleString() + '<br/>(' + ellapsed
            + ')');
          markers[name].addTo(map);
        } else {
          if (updates[name] <= updated) {
            markers[name].setLatLng(new L.LatLng(coords[0],
              coords[1]));
            markers[name].bindPopup('<b>' + name + '</b><br/>'
              + coords[0].toFixed(6) + ', '
              + coords[1].toFixed(6) + '<hr/>'
              + updated.toLocaleString() + '<br/>('
              + ellapsed + ')');
            updates[name] = updated;
            me.addToTail(name, coords[0], coords[1], map, cmp);
          }
        }

        var profile = profiles.getById(name),
          marker = markers[name];

        if (profile) {
          var d = new Date(Number(profile.getData().timestamp)),
            date = ('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
              d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
          marker.on('mouseover', function (e) {
            marker.plot = Ext.create('Ext.panel.Panel', {
              title: name + ' | ' + date,
              width: 300,
              height: 300,
              cls: 'plot',
              renderTo: cmp.el.dom,
              layout: 'fit',
              items: [{
                xtype: 'chart',
                style: {
                  'background': '#fff'
                },
                animate: true,
                shadow: false,
                store: Ext.create('Ext.data.JsonStore', {
                  fields: ['depth', 'value'],
                  data: profile.getData().samples
                }),
                axes: [{
                  type: 'numeric',
                  position: 'left',
                  title: 'Depth',
                  grid: true,
                  label: {
                    renderer: function (v) {return v + 'm'; }
                  }
                }, {
                  type: 'numeric',
                  position: 'bottom',
                  title: 'Temperature',
                  label: {
                    renderer: function (v) { return v + 'º'; }
                  }
                }],
                series: [{
                  type: 'line',
                  xField: 'depth',
                  yField: ['value'],
                  title: ['Depth', 'Temp'],
                  style: {
                    'stroke-width': 4
                  },
                  markerConfig: {
                    radius: 4
                  },
                  highlight: {
                    fill: '#000',
                    radius: 5,
                    'stroke-width': 2,
                    stroke: '#fff'
                  },
                  tips: {
                    trackMouse: true,
                    style: 'background: #FFF',
                    height: 20,
                    showDelay: 0,
                    dismissDelay: 0,
                    hideDelay: 0
                  }
                }]
              }]
            });
          });
          marker.on('mouseout', function (e) {
            if (marker.plot) marker.plot.destroy();
          });
        }

        cmp.setMarkers(markers);
        cmp.setUpdates(updates);
      });
    });

  },

  addToTail: function (name, lat, lon, map, cmp) {
    var pos = new L.LatLng(lat, lon),
      tails = cmp.getTails();

    if (tails[name] == undefined) {
      tails[name] = L.polyline({});
      tails[name].addTo(map);
    }
    tails[name].addLatLng(pos);
    if (tails[name].getLatLngs().length > 120)
      tails[name].spliceLatLngs(0, 1);

    cmp.setTails(tails);
  },

  positionsLoad: function (store, records) {
    var me = this,
      model = this.getViewModel(),
      activeMaps = model.get('activeMaps'),
      systems = this.getStore('systems');

    records.forEach(function (element, index, array) {
      var data = element.getData(),
        lat = data.lat,
        long = data.lon,
        updated = new Date(data.timestamp),
        imc_id = data.imc_id,
        name = systems.getById(imc_id).getData().name;
      Ext.iterate(activeMaps, function (key, value) {
        var map = value.down('leafletmap').getMap(),
          cmp = value.down('leafletmap');
        me.addToTail(name, lat, long, map, cmp);
      });
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
          selModel: {
            checkOnly: false,
            injectCheckbox: 'last',
            mode: 'SIMPLE'
          },
          selType: 'checkboxmodel',
          columns: [{
            dataIndex: 'title',
            flex: 1
          }],
          store: gibsStore,

          listeners: {
            select: function (view, record) {
              var data = record.getData(),
                now = new Date(),
                oneDay = 1000 * 60 * 60 * 24, // milliseconds in one day
                startTimestamp = now.getTime() - oneDay + now.getTimezoneOffset() * 60 * 1000 * 60 * 1000,
                startDate = new Date(startTimestamp), //previous day
                layer = new L.GIBSLayer(data.title,
                  {
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
              map.getMap().removeLayer(layer);
              delete gibsLayers[data.title];
              map.setGibsLayers(gibsLayers);
            }
          }
        }]
      }).show();
      cmp.setWindow(newWindow);
    }
  }

});