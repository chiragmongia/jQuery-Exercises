var ProductRating = function() {
  this.init();
}

ProductRating.prototype = {
  init: function() {
    this.ratingTypes = ['Love it', 'Like it', 'No Views', 'Dislike it', 'Abhor it'];
    this.productItems = ['Coffee', 'Tea', 'Sodas'];
    this.createRatingTypes();
    this.createProducts();
    this.bindEvents();
  },

  createRatingTypes: function() {
    var $ratingBlock = $('<ul class="ratingCategoryBlock"></ul>');
    $ratingBlock.appendTo($('#container'));
    for (var i = 0; i < this.ratingTypes.length; i++) {
      var $ratingOption = $('<li class="ratingCategory"></li>');
      $ratingOption.text(this.ratingTypes[i]);
      $ratingOption.attr('id', this.ratingTypes[i].split(" ").join(""));
      $ratingOption.appendTo($ratingBlock);
    }
  },

  createRadioButtons: function() {
    var $productItemBlock = $('<ul class="radioBlock"></ul>');
    for(var i = 0; i < this.ratingTypes.length; i++) {
      var $radioListItem = $('<li class="radioItem"><input type="radio"></li>');
      $radioListItem.appendTo($productItemBlock);
      $radioListItem.find('input').attr('class', this.ratingTypes[i].split(" ").join(""));
    }
    return $productItemBlock;
  },

  setRadioButtonAttr: function(radioButtonsBlock, productItem) {
    radioButtonsBlock.find('input').attr('name', productItem).attr('data-item-id', productItem);
    $('.ratingCategory').each(function(index) {
      var tempVar = productItem + "-" + $(this).attr('id');
      radioButtonsBlock.find('input').eq(index).attr('id', tempVar);
    });
  },

  createProducts: function() {
    for (var i = 0; i < this.productItems.length; i++) {
      var $productDiv = $('<div class="productsBlock"></div>');
      $productDiv.appendTo($('#container'));

      var $productNameElement = $('<p class="productItem">' + this.productItems[i] + '</p>');
      $productNameElement.attr('id', this.productItems[i]);
      $productNameElement.appendTo($productDiv);

      var $radioButtons = this.createRadioButtons();
      this.setRadioButtonAttr($radioButtons, this.productItems[i]);
      $radioButtons.appendTo($productDiv);
    }
  },

  bindEvents: function() {
    $('.productItem').bind('click', function() {
      $('.productItem').removeClass('selectedProduct highlight');
      $(this).addClass('selectedProduct highlight');
      $('.ratingCategory').removeClass('highlight selectedRatingCategory');

      if ($(this).hasClass('rated')) {
        $('.selectedProduct').data('selected-category').addClass('highlight');
      }

      else {
        $(this).addClass('rated');
      }
    });

    $('.ratingCategory').bind('click', function() {
      if ($('.productItem').hasClass('highlight')) {
        $(this).siblings().removeClass('selectedRatingCategory highlight');
        $(this).addClass('selectedRatingCategory highlight');
        $('.selectedProduct').data('selected-category', $('.selectedRatingCategory'));
        setRadioButtonState();
      }
    });

    $('.radioItem').find('input').bind('click', function() {
      $('.productItem').removeClass('highlight selectedProduct');
      $('.ratingCategory').removeClass('highlight selectedRatingCategory');
      var tempArray = $(this).attr('id').split('-');
      $('#' + tempArray[0]).addClass('highlight selectedProduct rated');
      $('#' + tempArray[1]).addClass('highlight selectedRatingCategory');
      $('.selectedProduct').data('selected-category', $('.selectedRatingCategory'));
    })

    function setRadioButtonState() {
      $('#' + $('.selectedProduct').attr('id') + "-" + $('.selectedRatingCategory').attr('id')).prop('checked', true);
    }
  }
}

$(document).ready(function() {
  var productRating = new ProductRating();
})