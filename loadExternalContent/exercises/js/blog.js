var SlideDown = function() {
  this.init();
}

SlideDown.prototype = {
  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    $('#blog a').bind('click', this.displayParagraph);
  },

  displayParagraph: function() {
    slidedown.slideUpAllParagraph();
    $(this).removeAttr('href');
    $(this).parent().next('p.excerpt').slideDown();
  },

  slideUpAllParagraph: function() {
    $('div p.excerpt').slideUp();
  }
}

var slidedown = new SlideDown();