var SlideShow = function() {
  this.init();
}

SlideShow.prototype = {
  init: function() {
    this.moveSlidesBlockOnTop();
    this.createImageNumberParagraph();
    this.highlightFirstSlideNumber();
    setInterval(this.displaySlides, 4000);
  },

  displaySlides: function() {
    $('#slideshow li:first').animate({
      'opacity':0,
    }, 1000, function() {
      $(this).appendTo($('#slideshow'));
      $(this).animate({ 'opacity':1 }, 1000);
      $('#' + $('.slide-container').attr('data-slide-number')).addClass('currentSlide');
    });

    $('#' + $('.slide-container').attr('data-slide-number')).removeClass('currentSlide');
  },

  createImageNumberParagraph: function() {
    var $numElement = $('<p class="currentImageElement">Image Number: </p>');
    $numElement.insertAfter('#slideshow');
    this.createImageNumbers($numElement);    
  },

  moveSlidesBlockOnTop: function() {
    $('#slideshow').insertBefore('#header');
  },

  // Creating Image Numbers for the total number of slides
  createImageNumbers: function(imageNumberParagraph) {
    $('.slide-container').each( function(index) { 
      var imageNumber = $('<span class="imageNumber"></span>').attr('id', index+1);
      imageNumber.appendTo(imageNumberParagraph);
      $('#' + (index+1)).text(index+1);
    });
  },

  highlightFirstSlideNumber: function() {
    $('#1').addClass('currentSlide');
  }
}

var slideshow = new SlideShow();