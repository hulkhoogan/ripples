Ext.define('Ripples.view.home.StoresLoads', {

  activeLoad: function (store, recs) {
    var me = this,
      model = this.getViewModel(),
      maps = model.get('maps');

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
      Ext.iterate(maps, function (key, value) {
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
    // if (tails[name].getLatLngs().length > 120)
    //   tails[name].spliceLatLngs(0, 1);

    cmp.setTails(tails);
  },

  positionsLoad: function (store, records) {
    var me = this,
      model = this.getViewModel(),
      activeMaps = model.get('activeMaps'),
      systems = this.getStore('systems');

    if (systems.isLoaded()) {
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
    }
    else {
      Ext.global.setTimeout(function () {
        me.positionsLoad(store, records);
      }, 400);
    }
  },

  profilesLoad: function (store, records) {
    // var profile = profiles.getById(name),
    //   marker = markers[name];
    //
    // if (profile) {
    //   var d = new Date(Number(profile.getData().timestamp)),
    //     date = ('0' + d.getHours()).slice(-2) + 'h:' + ('0' + d.getMinutes()).slice(-2) + 'm';
    //   marker.on('mouseover', function (e) {
    //     if (marker.plot) marker.plot.destroy();
    //     marker.plot = Ext.create('Ext.panel.Panel', {
    //       title: name + ' | ' + date,
    //       width: 300,
    //       height: 300,
    //       cls: 'plot',
    //       renderTo: cmp.el.dom,
    //       layout: 'fit',
    //       items: [{
    //         xtype: 'chart',
    //         style: {
    //           'background': '#fff'
    //         },
    //         animate: true,
    //         shadow: false,
    //         store: Ext.create('Ext.data.JsonStore', {
    //           fields: ['depth', 'value'],
    //           data: profile.getData().samples
    //         }),
    //         axes: [{
    //           type: 'numeric',
    //           position: 'left',
    //           title: 'Depth',
    //           grid: true,
    //           label: {
    //             renderer: function (v) {return v + 'm'; }
    //           }
    //         }, {
    //           type: 'numeric',
    //           position: 'bottom',
    //           title: 'Temperature',
    //           label: {
    //             renderer: function (v) { return v + 'º'; }
    //           }
    //         }],
    //         series: [{
    //           type: 'line',
    //           xField: 'depth',
    //           yField: ['value'],
    //           title: ['Depth', 'Temp'],
    //           style: {
    //             'stroke-width': 4
    //           },
    //           markerConfig: {
    //             radius: 4
    //           },
    //           highlight: {
    //             fill: '#000',
    //             radius: 5,
    //             'stroke-width': 2,
    //             stroke: '#fff'
    //           },
    //           tips: {
    //             trackMouse: true,
    //             style: 'background: #FFF',
    //             height: 20,
    //             showDelay: 0,
    //             dismissDelay: 0,
    //             hideDelay: 0
    //           }
    //         }]
    //       }]
    //     });
    //   });
    //   marker.on('mouseout', function (e) {
    //     if (marker.plot) marker.plot.destroy();
    //   });
    // }
  }

});