var ProductGrid = function() {
  this.init();
}

ProductGrid.prototype = {
  init: function() {
    this.filters = $('.filter');
    this.fetchJsonData();
    this.bindEvents();
  },

  bindEvents: function() {
    var obj = this;
    $('.checkbox').bind('change', function() {
      obj.filterData();
    });
  },

  fetchJsonData: function() {
    $.ajax({
      url:      'data/productsData.js',
      type:     'GET',
      dataType: 'json',
      success: function(json) {
        createStoreFrontPage(json);
      },
      error: function(xhr, status) {
        alert("PROBLEM");
      }
    });

    function createStoreFrontPage(json) {
      for (var i = 0; i < json.length; i++) {
        var $productGrid = $('<div class="productGrid"></div>');
        $productGrid.attr( { 'data-color': json[i].color, 'data-brand': json[i].brand, 'data-sold-out': json[i].sold_out });
        $('<img></img>').attr('src',json[i].url).appendTo($productGrid);
        $productGrid.appendTo($('#productsContainer'));
      }
    }
  },

  filterData: function() {
    var obj = this;
    var $allProducts = $('.productGrid');
    $('.filter').each(function(index, value) {
      $allProducts = obj.filterGroup($allProducts, value);
    });
    this.showFilteredProducts($allProducts);
  },

  filterGroup: function($filteredProducts, filterContainer) {
    var checkedCheckBox = $(filterContainer).find('input:checked');

    if ( checkedCheckBox.length == 0 ) {
      return $filteredProducts;
    }

    else {
      var filteredProductsArr = [];
      $(filterContainer).find('input:checked').each(function() {
        var obj = this;
        var filterName = $(this).attr('data-filter-name');
        var selectedValue = $(this).attr('data-' + filterName);
        $filteredProducts.each(function() {
          if ($(this).attr('data-' + filterName) == selectedValue) {
            filteredProductsArr.push(this);
          }
        })
      })
      return $(filteredProductsArr);
    }
  },

  showFilteredProducts: function(filteredProducts) {
    $('.productGrid').hide();
    $(filteredProducts).show();
  }
}

$(document).ready(function() {
  var productGrid = new ProductGrid();
})