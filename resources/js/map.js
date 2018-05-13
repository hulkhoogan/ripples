function loadPoi () {
  var poi_json = $.getJSON('/poi', function (data) {
    removeMarkers();
    $.each(data, function (i, item) {

      pois[item.description] = item;

      var record = {
        'author': item.author,
        'description': item.description,
        'coordinates': [item.coordinates[0], item.coordinates[1]]
      };
      marker = new L.marker([item.coordinates[0], item.coordinates[1]],
        {
          title: item.description,
          contextmenu: true,
          contextmenuItems: [{
            text: 'Edit Marker',
            icon: 'images/edit.png',
            callback: editMarker,
            index: 0
          }, {
            separator: true,
            index: 1
          }]
        });
      map.addLayer(marker);
      marker.bindPopup(item.description);
      marker.on('mouseover', function (e) {
        this.openPopup();
      });
      marker.on('mouseout', function (e) {
        this.closePopup();
      });
      marker.on('contextmenu', function (e) {
        selectedMarker = e.target.options.title;
      });
      plotlayers.push(marker);
      record = null;
    });
  });
};

var assets = {};
var lastPositions = {};
var ripplesRef = new Firebase('https://neptus.firebaseio.com/');
ripplesRef.child('assets').on('child_changed', updateAsset);
ripplesRef.child('assets').on('value', updateAsset);
ripplesRef.child('assets').on('child_added', updateAsset);
ripplesRef.child('ships').on('child_changed', updateShip);
ripplesRef.child('ships').on('child_added', updateShip);
ripplesRef.child('ships').on('value', updateAsset);

function updateAsset (snapshot) {
  var position = snapshot.val().position;

  if (position == undefined)
    return;

  var name = snapshot.key();
  var type = snapshot.val().type;
  var lat = position.latitude;
  var lon = position.longitude;
  var date = snapshot.val().updated_at;

  if (new Date().getTime() - date > 1000 * 60 * 60)
    return;

  var plan = snapshot.val().plan;

  if (plan == undefined)
    plans[name] = undefined;
  else {
    if (plan.path != undefined) {
      if (plans[name] == undefined)
        plans[name] = L.polyline({}, {
          color: 'green'
        }).addTo(map);
      else
        plans[name].setLatLngs([]);

      for (point in plan.path) {
        plans[name].addLatLng(L.latLng(plan.path[point]));
      }
    }
    // temporal plan
    if (plan.eta != undefined) {
      if (etaMarkers[name] != undefined) {
        etaMarkers[name].forEach(function (m) {
          map.removeLayer(m);
        });
      }
      etaMarkers[name] = [];
      plan.eta.forEach(function (eta, index) {

        if (eta > 0) {
          console.log(eta);
          var point = plan.path[index];
          var time = eta;
          var d = new Date(eta);
          var etaMarker = L.marker(point, {
            icon: wptGreen
          }).bindPopup(name + ' (' + (index + 1) + ')<hr/>' + d.toLocaleString());
          etaMarkers[name].push(etaMarker);
          etaMarker.addTo(map);
        }
      });
    }
  }

  addToTail(name, lat, lon);
  var pos = new L.LatLng(lat, lon);

  if (markers[name] != undefined) {
    markers[name].setLatLng(pos);
    markers[name].setIcon(sysIconFromName(type));
    markers[name].bindPopup('<b>' + name + '</b><br/>'
      + lat.toFixed(6) + ', ' + lon.toFixed(6) + '<hr/>'
      + new Date(date).toLocaleString());
    if ('Gunnerus' === name)
      markers[name].setIcon(targetIcon);
  } else {
    markers[name] = L.marker([lat, lon], {
      icon: sysIconFromName(type)
    }).bindPopup(
      '<b>' + name + '</b><br/>' + lat.toFixed(6) + ', '
      + lon.toFixed(6) + '<hr/>'
      + new Date(date).toLocaleString());
    markers[name].addTo(map);
  }
}

function updateShip (snapshot) {

  if (!snapshot.val().position) {
    return;
  }

  var position = snapshot.val().position;
  var name = snapshot.key();
  var type = snapshot.val().type;
  var lat = position.latitude;
  var lon = position.longitude;
  var speed = position.speed * 0.51444444444;
  var mmsi = position.mmsi;
  var heading = position.heading * Math.PI / 180.0;
  var cog = position.cog * Math.PI / 180.0;
  if (position.heading > 360)
    heading = cog;
  var date = snapshot.val().updated_at;
  var fillColor = '#0000ff';

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

  addToTail(name, lat, lon);

  var pos = new L.LatLng(lat, lon);

  if (ships[name] != undefined) {
    ships[name].setLatLng(pos);
    ships[name].setCourse(cog);
    ships[name].setHeading(heading);
    ships[name].setSpeed(speed);
  }
  else {
    ships[name] = L.trackSymbol(pos, {
      icon: shipIcon,
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
  }

  ships[name].bindPopup('<b>' + name + '</b><hr/>'
    + type + '<br/>'
    + lat.toFixed(6) + ', ' + lon.toFixed(6) + '<br/>'
    + speed.toFixed(1) + ' m/s<br/>'
    + '<a href="https://www.marinetraffic.com/en/ais/details/ships/mmsi:' + mmsi + '" target="_blank">more info</a><hr/>'
    + new Date().toLocaleString());
}

