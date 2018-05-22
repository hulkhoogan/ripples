Ext.define('Ripples.view.home.FireBase', {

  updateAsset: function (snapshot) {
    if (!snapshot.val()) {
      return;
    }
    var me = Ripples.getApplication().getMainView().down('home').lookupController(),
      model = me.getViewModel(),
      activeMaps = model.get('maps');

    Ext.iterate(activeMaps, function (key, value) {
      var map = value.down('leafletmap').getMap(),
        cmp = value.down('leafletmap'),
        markers = cmp.getMarkers(),
        updates = cmp.getUpdates(),
        position = snapshot.val().position,
        plans = cmp.getPlans(),
        etaMarkers = cmp.getEtaMarkers();
      if (position === undefined)
        return;
      var name = snapshot.key(),
        type = snapshot.val().type,
        lat = position.latitude,
        lon = position.longitude,
        date = snapshot.val().updated_at;

      if (new Date().getTime() - date > 1000 * 60 * 60)
        return;

      var plan = snapshot.val().plan;

      if (plan === undefined)
        plans[name] = undefined;
      else {
        if (plan.path !== undefined) {
          if (plans[name] === undefined)
            plans[name] = L.polyline({}, {
              color: 'green'
            }).addTo(map);
          else
            plans[name].setLatLngs([]);

          for (var point in plan.path) {
            plans[name].addLatLng(L.latLng(plan.path[point]));
          }
        }
        // temporal plaan
        if (plan.eta !== undefined) {
          if (etaMarkers[name] !== undefined) {
            etaMarkers[name].forEach(function (m) {
              map.removeLayer(m);
            });
          }
          etaMarkers[name] = [];
          plan.eta.forEach(function (eta, index) {

            if (eta > 0) {
              var point = plan.path[index],
                time = eta,
                d = new Date(eta),
                etaMarker = L.marker(point, {
                  icon: me.getIconById('wptGreen')
                }).bindPopup(name + ' (' + (index + 1) + ')<hr/>' + d.toLocaleString());
              etaMarkers[name].push(etaMarker);
              etaMarker.addTo(map);
            }
          });
        }
      }

      cmp.setPlans(plans);
      cmp.setEtaMarkers(etaMarkers);

      me.addToTail(name, lat, lon, map, cmp);

      var pos = new L.LatLng(lat, lon);

      if (markers[name] !== undefined) {
        markers[name].setLatLng(pos);
        markers[name].setIcon(me.getIconByName(type));
        markers[name].bindPopup('<b>' + name + '</b><br/>'
          + lat.toFixed(6) + ', ' + lon.toFixed(6) + '<hr/>'
          + new Date(date).toLocaleString());
        if ('Gunnerus' === name)
          markers[name].setIcon(me.getIconById('targetIcon'));
      } else {
        markers[name] = L.marker([lat, lon], {
          icon: me.getIconByName(type)
        }).bindPopup(
          '<b>' + name + '</b><br/>' + lat.toFixed(6) + ', '
          + lon.toFixed(6) + '<hr/>'
          + new Date(date).toLocaleString());
        markers[name].addTo(map);
      }

      cmp.setMarkers(markers);
    });

  },

  updateShip: function (snapshot) {
    var me = Ripples.getApplication().getMainView().down('home').lookupController(),
      model = me.getViewModel(),
      activeMaps = model.get('maps');
    Ext.iterate(activeMaps, function (key, value) {
      var map = value.down('leafletmap').getMap(),
        cmp = value.down('leafletmap'),
        markers = cmp.getMarkers(),
        updates = cmp.getUpdates(),
        ships = cmp.getShips();

      if (!snapshot.val().position) {
        return;
      }

      var position = snapshot.val().position,
        name = snapshot.key(),
        type = snapshot.val().type,
        lat = position.latitude,
        lon = position.longitude,
        speed = position.speed * 0.51444444444,
        mmsi = position.mmsi,
        heading = position.heading * Math.PI / 180.0,
        cog = position.cog * Math.PI / 180.0;
      if (position.heading > 360)
        heading = cog;
      var date = snapshot.val().updated_at,
        fillColor = '#0000ff';

      switch (type) {
        case 'Fishing':
        case '30':
          type = 'Fishing';
          fillColor = '#0fff00';
          break;
        case 'CargoHazardousA':
        case 'CargoHazardousB':
        case 'CargoHazardousC':
        case '80':
          type = 'Hazardous Cargo';
          fillColor = '#ff0000';
          break;
        case '75':
        case '76':
        case '77':
        case '78':
        case '79':
          type = 'Cargo';
          fillColor = '#ffcccc';
          break;
        case 'Tug':
          fillColor = '#ffff00';
          break;
        case 'Tanker':
          fillColor = '#cc9900';
          break;
        default:
          fillColor = '#cccccc';
          break;
      }

      if (new Date().getTime() - date > 1000 * 60 * 20)
        return;

      me.addToTail(name, lat, lon, map, cmp);

      var pos = new L.LatLng(lat, lon);

      if (ships[name] !== undefined) {
        ships[name].setLatLng(pos);
        ships[name].setCourse(cog);
        ships[name].setHeading(heading);
        ships[name].setSpeed(speed);
      }
      else if (heading > 0) {
        ships[name] = L.trackSymbol(new L.LatLng(lat, lon), {
          icon: me.getIconById('shipIcon'),
          fill: true,
          fillColor: fillColor,
          fillOpacity: 0.7,
          stroke: true,
          color: '#000000',
          opacity: 1.0,
          weight: 1.0,
          course: cog,
          heading: heading,
          speed: speed
        });
        ships[name].addTo(map);
        ships[name].bindPopup('<b>' + name + '</b><hr/>'
          + type + '<br/>'
          + lat.toFixed(6) + ', ' + lon.toFixed(6) + '<br/>'
          + speed.toFixed(1) + ' m/s<br/>'
          + '<a href="https://www.marinetraffic.com/en/ais/details/ships/mmsi:' + mmsi + '" target="_blank">more info</a><hr/>'
          + new Date().toLocaleString());
      }

      cmp.setShips(ships);
    });
  }

});