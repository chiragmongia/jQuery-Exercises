var SlideDown = function() {
  this.init();
}

SlideDown.prototype = {
  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    $('#blog .heading-link').bind('click', function() {
      $('#blog .excerpt').slideUp();
      $(this).removeAttr('href');
      $("." + $(this).attr('id') + "-excerpt").slideDown();
    });
  }
}

var slidedown = new SlideDown();