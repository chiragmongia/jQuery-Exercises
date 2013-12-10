var SlideShow = function() {
  this.slideShowBlock = $('#slideshow');
  this.slideContainer = $('.slide-container');
  this.init();
}

SlideShow.prototype = {
  init: function() {
    this.setUpPageForSlideShow();
    this.startSlideShow();
  },

  setUpPageForSlideShow: function() {
    this.moveSlidesBlockOnTop();
    this.createImageNumberParagraph();
  },

  startSlideShow: function() {
    $('#image-number-1').addClass('currentSlide');
    setInterval(this.displaySlides, 4000);  
  },

  displaySlides: function() {
    $('#slideshow li:first').animate({
      'opacity':0,
    }, 1000, function() {
      $(this).appendTo($('#slideshow'));
      $(this).animate({ 'opacity':1 }, 1000);
      $('#image-number-' + $('.slide-container:visible').attr('data-slide-number')).addClass('currentSlide');
    });

    $('#image-number-' + $('.slide-container:visible').attr('data-slide-number')).removeClass('currentSlide');
  },

  createImageNumberParagraph: function() {
    var $numElement = $('<p class="currentImageElement">Image Number: </p>');
    $numElement.insertAfter(this.slideShowBlock);
    this.createImageNumbers($numElement);
  },

  moveSlidesBlockOnTop: function() {
    this.slideShowBlock.insertBefore('#header');
  },

  // Creating Image Numbers for the total number of slides
  createImageNumbers: function(imageNumberParagraph) {
    this.slideContainer.each( function(index) {
      var imageNumber = $('<span />', { id: ('image-number-' + (index+1)), text: (index+1), class: 'imageNumber' });
      imageNumber.appendTo(imageNumberParagraph);
    });
  },
}

$(document).ready(function() {
  var slideshow = new SlideShow();
})