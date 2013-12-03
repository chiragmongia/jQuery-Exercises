var DropDown = function() {
  this.init();
}

DropDown.prototype = {
  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    $('.nav-links').hover(
      function() {
        $(this).addClass('selected');
        $(this).children('.sub-menu').addClass('hover');
      },

      function() {
        $(this).removeClass('selected');
        $(this).children('.sub-menu').removeClass('hover');
      }
    );
  }
}

var dropDown = new DropDown();