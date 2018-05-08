Ext.define('Ripples.libraries.LeafletIcons', {

  icons: [{
    itemId: 'argosIcon',
    url: 'icons/ico_argos.png',
    type: 'sys'
  }, {
    itemId: 'uavIcon',
    url: 'icons/ico_uav.png',
    type: 'sys'
  }, {
    itemId: 'auvIcon',
    url: 'icons/ico_auv.png',
    type: 'sys'
  }, {
    itemId: 'unknownIcon',
    url: 'icons/ico_unknown.png',
    type: 'sys'
  }, {
    itemId: 'ccuIcon',
    url: 'icons/ico_ccu.png',
    type: 'sys'
  }, {
    itemId: 'spotIcon',
    url: 'icons/ico_spot.png',
    type: 'sys'
  }, {
    itemId: 'targetIcon',
    url: 'icons/ico_target.png',
    type: 'sys'
  }, {
    itemId: 'desiredIcon',
    url: 'icons/ico_desired.png',
    type: 'sys'
  }, {
    itemId: 'extSysIcon',
    url: 'icons/ico_external.png',
    type: 'sys'
  }, {
    itemId: 'planeIcon',
    url: 'icons/ico_plane.png',
    type: 'sys'
  }, {
    itemId: 'shipIcon',
    url: 'icons/ico_ship.png',
    type: 'sys'
  }, {
    itemId: 'usvIcon',
    url: 'icons/ico_usv.png',
    type: 'sys'
  }, {
    itemId: 'wptGreen',
    url: 'icons/wpt_green.png',
    type: 'wpt'
  }, {
    itemId: 'wptRed',
    url: 'icons/wpt_red.png',
    type: 'wpt'
  }, {
    itemId: 'wptGray',
    url: 'icons/wpt_gray.png',
    type: 'wpt'
  }],

  getIconById: function (itemId) {
    var icon = null;
    this.icons.forEach(function (item) {
      if (item.itemId === itemId) {
        icon = item;
      }
    }.bind(this));
    if (icon) {
      var leafletIcon;
      switch (icon.type) {
        case 'sys':
          leafletIcon = L.Icon.extend({
            options: {
              iconUrl: Ext.getResourcePath(icon.url),
              shadowUrl: Ext.getResourcePath('icons/shadow.png'),
              iconSize: [22, 32],
              shadowSize: [24, 24],
              iconAnchor: [11, 32],
              shadowAnchor: [8, 24],
              popupAnchor: [0, -32]
            }
          });
          break;
        case 'wpt':
          leafletIcon = L.Icon.extend({
            options: {
              iconUrl: Ext.getResourcePath(icon.url),
              shadowUrl: Ext.getResourcePath('icons/shadow.png'),
              iconSize: [12, 12],
              shadowSize: [0, 0],
              iconAnchor: [6, 6],
              shadowAnchor: [6, 6],
              popupAnchor: [0, 0]
            }
          });
          break;
        default: {}
      }
      return leafletIcon;
    } else {
      console.error('Unknown icon \'' + itemId + '\'.');
    }
  }
});