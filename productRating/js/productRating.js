var ProductRating = function() {
  this.init();
}

ProductRating.prototype = {
  init: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    $('.productItem').bind('click', function() {
      $(this).addClass('selectedItem').siblings().removeClass('selectedItem');
      $('.ratingCategory').removeClass('selectedRatingCategory');
    });

    $('.ratingCategory').bind('click', function() {
      $(this).addClass('selectedRatingCategory').siblings().removeClass('selectedRatingCategory');
      $('.selectedItem').next('.ratingBlock').find('.' + $(this).attr('data-class-name')).prop('checked', true);
    });
  }
}

var productRating = new ProductRating();