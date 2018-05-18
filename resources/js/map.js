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