var ProductGrid = function() {
  this.init();
}

ProductGrid.prototype = {
  init: function() {
    this.filters = $('.filter');
    this.container = $('#container');
    this.paginateOptions = $('#paginateOptions');
    this.fetchJsonData();
    this.bindEvents();
  },

  bindEvents: function() {
    this.filtersListener();
    this.paginationListener();
  },

  filtersListener: function() {
    var obj = this;
    $('.productFilter').bind('change', function() {
      obj.filterData();
    });    
  },

  paginationListener: function() {
    var obj = this;
    this.container.delegate('.page-numbers', 'click', function() {
      $(this).addClass('highlight').siblings().removeClass('highlight');
      obj.pageNumberListener(this.textContent);
    });
  },

  fetchJsonData: function() {
    var obj = this;
    $.ajax({
      url:      'data/productsData.js',
      type:     'GET',
      dataType: 'json',
      success: function(json) {
        createStoreFrontPage(json);
      },
      error: function(xhr, status) {
        alert("PROBLEM");
      },
      complete: function() {
        obj.allProducts = $('.productGrid');
        obj.createPageFooter(obj.allProducts);
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
    this.filteredProducts = $allProducts;
    this.paginateProducts($allProducts);
  },

  filterGroup: function($filteredProducts, filterContainer) {
    var checkedCheckBoxes = $(filterContainer).find('input:checked');

    if ( checkedCheckBoxes.length ) {
      var filteredProductsArr = [];
      checkedCheckBoxes.each(function() {
        var $this = $(this);
        var filterName = $this.attr('data-filter-name');
        var selectedValue = $this.attr('value');

        $filteredProducts.filter("[data-" + filterName + "='" + selectedValue + "']").each(function() {
          filteredProductsArr.push(this);
        });
      })
      return $(filteredProductsArr);
    }
    return $filteredProducts;
  },

  getTotalPages: function(filteredProducts, paginateValue) {
    return Math.ceil((filteredProducts.length)/paginateValue);
  },

  createPageFooter: function(filteredProducts) {
    var paginateValue = this.paginateOptions.val();
    var totalPages = this.getTotalPages(filteredProducts, paginateValue);
    this.createPageFooterElements(totalPages);
    $('.page-numbers:first').addClass('highlight');
    this.showFilteredProducts(filteredProducts, 0, paginateValue);
  },

  createPageFooterElements: function(totalPages) {
    var $footerDiv = $('<div />', { 'class': 'footerContainer' });
    for (var i = 0; i < totalPages; i++ ) {
      var $paraElement = $('<p />', { 'class': 'page-numbers', 'text': (i+1) });
      $footerDiv.append($paraElement);
    }
    this.container.append($footerDiv);
  },

  paginateProducts: function(filteredProducts) {
    $('.footerContainer').empty();
    this.createPageFooter(filteredProducts);
  },

  getInitialValueOfDisplayedProducts: function(selectedPageNumber, paginateValue) {
    return (parseInt(selectedPageNumber) - 1) * parseInt(paginateValue);
  },

  pageNumberListener: function(selectedPageNumber) {
    var paginateValue = this.paginateOptions.val();
    var initialValue = this.getInitialValueOfDisplayedProducts(selectedPageNumber, paginateValue);
    var finalValue = initialValue + parseInt(paginateValue);
    var filteredProducts = this.filteredProducts || this.allProducts;
    this.showFilteredProducts(filteredProducts, initialValue, finalValue);
  },

  showFilteredProducts: function(filteredProducts, initialValue, finalValue) {
    this.allProducts.filter(':visible').hide();
    $(filteredProducts).slice(initialValue, finalValue).show();
  }
}

$(document).ready(function() {
  var productGrid = new ProductGrid();
})