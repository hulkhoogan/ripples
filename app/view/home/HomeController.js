Ext.define('Ripples.view.home.HomeController', {
  extend: 'Ext.app.ViewController',
  alias: 'controller.home',

  toogleMap: function (button) {
    var itemId = '#' + button.name,
      cmp = this.getView().down(itemId),
      container = (button.name === 'map3' || button.name === 'map4');
    if (cmp.hidden) {
      cmp.show();
      if (container) {
        var cmpContainer = cmp.up();
        cmpContainer.show();
        cmpContainer.activeItems = cmpContainer.activeItems + 1;
      }
    }
    else {
      cmp.hide();
      if (container) {
        var cmpContainer = cmp.up();
        cmpContainer.activeItems = cmpContainer.activeItems - 1;
        if (cmpContainer.activeItems === 0) {
          cmpContainer.hide();
        }
      }
    }

  }
});