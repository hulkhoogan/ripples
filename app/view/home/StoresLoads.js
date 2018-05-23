Ext.define('Ripples.view.home.StoresLoads', {

  requires: [
    'Ext.chart.CartesianChart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.series.Line',
    'Ext.data.JsonStore',
    'Ext.layout.container.Fit',
    'Ext.panel.Panel',
    'Ext.slider.Single',
    'Ext.util.Format'
  ],

  activeLoad: function (store, recs) {
    var me = this,
      model = this.getViewModel(),
      storePlans = this.getStore('plans'),
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
    if (!storePlans.isLoaded()) {
      storePlans.load();
    }

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
      activeMaps = model.get('maps'),
      systems = this.getStore('systems'),
      plans = this.getStore('plans');

    if (systems.isLoaded() && plans.isLoaded()) {
      records.forEach(function (element, index, array) {
        var data = element.getData(),
          lat = data.lat,
          long = data.lon,
          updated = new Date(data.timestamp),
          imc_id = data.imc_id,
          name = systems.getById(imc_id).getData().name;
        element.name = name;
        Ext.iterate(activeMaps, function (key, value) {
          var map = value.down('leafletmap').getMap(),
            cmp = value.down('leafletmap'),
            markers = cmp.getMarkers(),
            plans = cmp.getPlans();

          me.addToTail(name, lat, long, map, cmp);

          var marker = markers[name],
            old_positions = store.queryBy(function (record) {
              let getName = systems.getById(record.get('imc_id'));
              if (getName) {
                let recordName = getName.getData().name;
                return recordName === name;
              }
              else {
                return false;
              }
            });
          var firstDate = new Date(old_positions.items[old_positions.length - 1].data.timestamp).getTime() - 3600000,
            lastDate,
            lastState,
            activeState;
          if (marker.plan) {
            var plan = marker.plan;
            lastDate = plan.waypoints[plan.waypoints.length - 1].eta * 1000;
            if (marker.lastState) {
              activeState = marker.lastState.time * 1000;
              lastState = marker.lastState;
            }
            if (lastDate < firstDate) {
              lastDate = new Date(old_positions.items[0].data.timestamp).getTime() - 3600000;
            }
          }
          else {
            lastDate = new Date(old_positions.items[0].data.timestamp).getTime() - 3600000;
          }

          if (!lastState) {
            activeState = lastDate;
          }
          else {
            marker.setLatLng(new L.LatLng(lastState.latitude, lastState.longitude));
          }
          if (lastDate > firstDate)
            marker.on('click', function () {
              if (marker.slider) marker.slider.destroy();
              marker.slider = Ext.create('Ext.panel.Panel', {
                width: 300,
                height: 60,
                cls: 'slider',
                renderTo: cmp.el.dom,
                layout: 'fit',
                padding: 5,
                items: [{
                  xtype: 'slider',
                  middlepoint: activeState,
                  minValue: firstDate,
                  value: activeState,
                  maxValue: lastDate,
                  increment: 1000, // 1s interval
                  listeners: {
                    change: function () {
                      value = this.getValues()[0];
                      if (value < this.middlepoint - 2000) {
                        var selected = null,
                          bestDiff = Number.MAX_SAFE_INTEGER;
                        old_positions.items.forEach(function (record) {
                          var date = (new Date(record.get('timestamp')).getTime() - 3600000),
                            diff = Math.abs(date - value);
                          if (diff < bestDiff) {
                            selected = record;
                            bestDiff = diff;
                          }
                        });
                        var data = selected.getData();
                        marker.setLatLng(new L.LatLng(data.lat, data.lon));
                      }
                      else if (value > this.middlepoint + 2000) {
                        var lastWaypoint = plan.waypoints[plan.waypoints.length - 1],
                          timestamp1 = this.middlepoint,
                          timestamp2 = lastWaypoint.eta * 1000,
                          point1 = {
                            x: marker.lastState.latitude,
                            y: marker.lastState.longitude
                          }, point2 = {
                            x: lastWaypoint.latitude,
                            y: lastWaypoint.longitude
                          };
                        marker.plan.waypoints.forEach(function (waypoint) {
                          var testTime = (waypoint.eta * 1000);
                          if (value > testTime && testTime > timestamp1) {
                            point1 = {x: waypoint.latitude, y: waypoint.longitude};
                            timestamp1 = testTime;
                          }
                          else if (value < testTime && testTime < timestamp2) {
                            point2 = {x: waypoint.latitude, y: waypoint.longitude};
                            timestamp2 = testTime;
                          }
                        });
                        var distT = me.calcTotalDist(point1, point2),
                          vel = me.calcVel(distT, timestamp1, timestamp2),
                          dist = me.calcDist(vel, value - timestamp1),
                          finalPoint = me.calcPoint(point1, point2, dist, distT);

                        marker.setLatLng(new L.LatLng(finalPoint.x, finalPoint.y));
                      }
                      else {
                        console.log('last state');
                        console.log(marker.lastState);
                        /**
                         * TODO
                         * Se !lastState -> last position ou active
                         * Se lastState -> position
                         */
                      }
                    }
                  }
                }]
              });
            });

        });
      });
    }
    else {
      Ext.global.setTimeout(function () {
        me.positionsLoad(store, records);
      }, 400);
    }
  },

  calcVel: function (d, t1, t2) {
    return d / (t2 - t1);
  },
  calcTotalDist: function (p1, p2) {
    return Math.sqrt(Math.abs(p1.x - p2.x) * Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) * Math.abs(p1.y - p2.y));
  },
  calcDist: function (vel, time) {
    return vel * time;
  },
  calcPoint: function (p1, p2, d, dt) {
    var x, y;
    x = p1.x + ((d / dt) * (p2.x - p1.x));
    y = p1.y + ((d / dt) * (p2.y - p1.y));
    return {
      x: x,
      y: y
    };
  },

  profilesLoad: function (store, records) {
    var me = this,
      model = this.getViewModel(),
      activeMaps = model.get('maps');

    records.forEach(function (element, index, array) {
      var data = element.getData(),
        lat = data.latitude,
        long = data.longitude;

      Ext.iterate(activeMaps, function (key, value) {
        var map = value.down('leafletmap').getMap(),
          cmp = value.down('leafletmap'),
          d = new Date(Number(element.getData().timestamp)),
          date = ('0' + d.getHours()).slice(-2) + 'h:' + ('0' + d.getMinutes()).slice(-2) + 'm',
          marker = new L.marker(L.latLng(lat, long), {
            icon: me.getIconById('info')
          });
        marker.addTo(map);
        marker.on('mouseover', function (e) {
          if (marker.plot) marker.plot.destroy();
          marker.plot = Ext.create('Ext.panel.Panel', {
            title: data.source + ' | ' + date,
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
                data: element.getData().samples
              }),
              axes: [{
                type: 'numeric',
                position: 'left',
                title: 'Temperature',
                grid: true
                // renderer: function (axis, v) { return Ext.util.Format.number(v, '000.000') + 'º'; }
              }, {
                type: 'numeric',
                position: 'bottom',
                title: 'Depth'
                // renderer: function (axis, v) { return Ext.util.Format.number(v, '000') + 'm'; }
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

      });
    });
  },

  plansLoad: function (store, recs) {
    var me = this,
      model = this.getViewModel(),
      systems = this.getStore('systems'),
      maps = model.get('maps');

    if (systems.isLoaded()) {
      recs.forEach(function (element, index, array) {
        var data = element.getData(),
          plan = data.plan,
          name = data.name,
          lastState = data.lastState;
        if (!plan) {
          return;
        }
        Ext.iterate(maps, function (key, value) {
          var map = value.down('leafletmap').getMap(),
            cmp = value.down('leafletmap'),
            markers = cmp.getMarkers(),
            plans = cmp.getPlans();

          if (plan.waypoints.length > 0) {
            if (plan.waypoints[0].eta) {

              if (markers[name] !== undefined) {
                if (!plans[plan.id]) {
                  plans[plan.id] = {
                    waypoints: plan.waypoints,
                    layer: L.polyline({})
                  };
                  plans[plan.id]['layer'].addLatLng(new L.LatLng(lastState.latitude, lastState.longitude));
                  plans[plan.id]['layer'].addTo(map);
                  plans[plan.id]['layer'].bringToFront();
                }
              }
              var layer = plans[plan.id]['layer'];
              plan.waypoints.forEach(function (waypoint) {
                layer.addLatLng(new L.LatLng(waypoint.latitude, waypoint.longitude));
                // var marker = new L.Marker(new L.LatLng(waypoint.latitude, waypoint.longitude));
                // // marker.addTo(map);
              });
              markers[name].plan = plans[plan.id];
              markers[name].lastState = lastState;
              cmp.setPlans(plans);
            }
          }
        });
      });
    }
    else {
      Ext.global.setTimeout(function () {
        me.plansLoad(store, recs);
      }, 400);
    }
  }

});