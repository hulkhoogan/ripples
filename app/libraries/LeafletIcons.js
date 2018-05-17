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
    itemId: 'asvIcon',
    url: 'icons/ico_usv.png',
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
  }, {
    itemId: 'info',
    url: 'images/info.png',
    type: 'sys'
  }],

  getIconByName: function (name) {
    switch (name.toUpperCase()) {
      case 'UUV':
        return this.getIconById('auvIcon');
      case 'UAV':
        return this.getIconById('uavIcon');
      case 'CCU':
        return this.getIconById('ccuIcon');
      case 'USV':
        return this.getIconById('usvIcon');
      case 'STATICSENSOR':
      case 'MOBILESENSOR':
        return this.getIconById('spotIcon');
      case 'MANNED_SHIP':
        return this.getIconById('shipIcon');
      case 'MANNED_AIRPLANE':
        return this.getIconById('planeIcon');
      case 'MANNED_CAR':
      case 'UGV':
      case 'PERSON':
      default:
        return this.getIconById('unknownIcon');
    }

  },

  getIconByImcid: function (imcId) {

    var sys_selector = 0xE000,
      vtype_selector = 0x1c00;

    if (imcId >= 0x8401 && imcId <= 0x841a)
      return this.getIconById('spotIcon');

    // External System
    if (imcId > 0x0000 + 0xFFFF)
      return this.getIconById('extSysIcon');

    var sys_type = (imcId & sys_selector) >> 13;

    switch (sys_type) {
      case 0:
        return this.getIconById('auvIcon');
        break;
      case 1:
        switch ((imcId & vtype_selector) >> 10) {
          case 0:
            return this.getIconById('auvIcon');
          case 1:
            return this.getIconById('unknownIcon'); // rov
          case 2:
            return this.getIconById('asvIcon'); // asv
          case 3:
            return this.getIconById('uavIcon');
          default:
            return this.getIconById('unknownIcon'); // uxv
        }
      case 2:
        return this.getIconById('ccuIcon');
      default:
        return this.getIconById('unknownIcon');
    }
  },

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
          var sys = L.Icon.extend({
            options: {
              shadowUrl: Ext.getResourcePath('icons/shadow.png'),
              iconSize: [22, 32],
              shadowSize: [24, 24],
              iconAnchor: [11, 32],
              shadowAnchor: [8, 24],
              popupAnchor: [0, -32]
            }
          });
          leafletIcon = new sys({
            iconUrl: Ext.getResourcePath(icon.url)
          });
          break;
        case 'wpt':
          var wpt = L.Icon.extend({
            options: {
              shadowUrl: Ext.getResourcePath('icons/shadow.png'),
              iconSize: [12, 12],
              shadowSize: [0, 0],
              iconAnchor: [6, 6],
              shadowAnchor: [6, 6],
              popupAnchor: [0, 0]
            }
          });
          leafletIcon = new wpt({
            iconUrl: Ext.getResourcePath(icon.url)
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