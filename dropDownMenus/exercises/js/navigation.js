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
        $(this).find('.sub-menu').addClass('hover');
      },

      function() {
        $(this).removeClass('selected');
        $(this).find('.sub-menu').removeClass('hover');
      }
    );
  }
}

var dropDown = new DropDown();