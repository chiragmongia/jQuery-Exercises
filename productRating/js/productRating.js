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

  bindEvents: function() {
    this.products = $('.productItem');
    this.ratings  = $('.ratingCategory');
    this.productItemListener();
    this.ratingCategoryListener();
    this.radioButtonListener();
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
    var $radioBlock = $('<ul class="radioBlock"></ul>');
    for(var i = 0; i < this.ratingTypes.length; i++) {
      var $radioListItem = $('<li class="radioItem"><input type="radio"></li>');
      $radioListItem.appendTo($radioBlock);
      $radioListItem.find('input').attr('class', this.ratingTypes[i].split(" ").join(""));
    }
    return $radioBlock;
  },

  setRadioButtonAttr: function(radioButtonsBlock, productItem) {
    var obj = this;
    radioButtonsBlock.find('input').attr('name', productItem).attr('data-item-id', productItem);
    $('.ratingCategory').each(function(index) {
      var radioButtonId = obj.generateRadioButtonId(this, productItem);
      radioButtonsBlock.find('input').eq(index).attr('id', radioButtonId);
    });
  },

  generateRadioButtonId: function(radioButton, productItem) {
    var $radioButton = $(radioButton),
        tempVar      = productItem + "-" + $radioButton.attr('id');
    return tempVar;
  },

  createProducts: function() {
    for (var i = 0; i < this.productItems.length; i++) {
      var $productsBlock = $('<div class="productsBlock"></div>');
      $productsBlock.appendTo($('#container'));

      var $productNameElement = $('<p class="productItem">' + this.productItems[i] + '</p>');
      $productNameElement.attr('id', this.productItems[i]);
      $productNameElement.appendTo($productsBlock);

      var $radioButtonsBlock = this.createRadioButtons();
      this.setRadioButtonAttr($radioButtonsBlock, this.productItems[i]);
      $radioButtonsBlock.appendTo($productsBlock);
    }
  },

  productItemListener: function() {
    var obj = this;
    this.products.bind('click', function() {
      var $this = $(this);
      obj.clearHighlightedProducts();
      $this.addClass('selectedProduct highlight');
      obj.clearHighlightedRatings();

      if ($this.hasClass('rated')) {
        $('#' + $('.selectedProduct').data('selected-category')).addClass('highlight');
      }
    });
  },

  radioButtonListener: function() {
    var obj = this;
    $('.radioItem').find('input').bind('click', function() {
      var $this = $(this);
      obj.clearHighlightedProducts();
      obj.clearHighlightedRatings();
      var tempArray = $this.attr('id').split('-');
      var selectedProduct  = $('#' + tempArray[0]).addClass('highlight selectedProduct rated');
      var selectedCategory = $('#' + tempArray[1]).addClass('highlight selectedRatingCategory');
      selectedProduct.data('selected-category', selectedCategory.attr('id'));
    });
  },

  ratingCategoryListener: function() {
    var obj = this;
    this.ratings.bind('click', function() {
      var $this = $(this);
      if (obj.products.hasClass('highlight')) {
        $('.selectedProduct').addClass('rated');
        obj.clearHighlightedRatings();
        $this.addClass('selectedRatingCategory highlight');
        $('.selectedProduct').data('selected-category', $('.selectedRatingCategory').attr('id'));
        $('#' + $('.selectedProduct').attr('id') + "-" + $('.selectedRatingCategory').attr('id')).prop('checked', true);
      }
    });
  },

  clearHighlightedProducts: function() {
    this.products.removeClass('highlight selectedProduct');
  },

  clearHighlightedRatings: function() {
    this.ratings.removeClass('highlight selectedRatingCategory');
  }
}

$(document).ready(function() {
  var productRating = new ProductRating();
})