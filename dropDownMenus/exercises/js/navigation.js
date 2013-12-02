var DropDown = function() {
  this.init();
}

DropDown.prototype = {
  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    $('#nav').children().hover(this.showSubMenu, this.hideSubMenu);
  },

  showSubMenu: function() {
    $(this).children('ul').addClass('hover');
  },

  hideSubMenu: function() {
    $(this).children('ul').removeClass('hover');
  }
}

var dropDown = new DropDown();