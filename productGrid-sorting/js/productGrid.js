var ProductGrid = function() {
  this.init();
}

ProductGrid.prototype = {
  init: function() {
    this.filters = $('.filter');
    this.container = $('#container');
    this.fetchJsonData();
    this.bindEvents();
  },

  bindEvents: function() {
    this.filtersListener();
    this.paginationListener();
    this.sortingListener();
  },

  filtersListener: function() {
    var obj = this;
    $('.checkbox, .paginateOption').bind('change', function() {
      obj.filterData(obj.allProducts);
    });
  },

  paginationListener: function() {
    var obj = this;
    this.container.delegate('.page-numbers', 'click', function() {
      $(this).addClass('highlight').siblings().removeClass('highlight');
      obj.pageNumberListener(this.textContent);
    });
  },

  sortingListener: function() {
    var obj = this;
    $('.sortOption').bind('change', function() {
      obj.sortOptionListener(this.value);
    })
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
        obj.sortProducts($('.productGrid'));
        obj.createPageFooter($('.productGrid'));
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

  filterData: function($allProducts) {
    var obj = this;
    var $sortedProducts = this.sortProducts($allProducts);
    $('.filter').each(function(index, value) {
      $sortedProducts = obj.filterGroup($sortedProducts, value);
    });
    var selectedSortOption = $('.sortOption').val();
    $sortedProducts.sort(this.sorterFunction(selectedSortOption));
    this.filteredProducts = $sortedProducts;
    this.paginateProducts(this.filteredProducts);
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
    var totalPages = Math.floor((filteredProducts.length)/paginateValue);
    if ((filteredProducts.length) % paginateValue == 0)
      return totalPages;
    else
      return totalPages + 1;
  },

  createPageFooter: function(filteredProducts) {
    var paginateValue = $('.paginateOption').val();
    var totalPages = this.getTotalPages(filteredProducts, paginateValue);
    this.createPageFooterElements(totalPages);
    this.showFilteredProducts(filteredProducts, paginateValue);
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

  getFinalValueOfDisplayedProducts: function(selectedPageNumber, paginateValue) {
    return parseInt(selectedPageNumber) * parseInt(paginateValue);
  },

  pageNumberListener: function(selectedPageNumber) {
    var paginateValue = $('.paginateOption').val();
    var initialValue = this.getInitialValueOfDisplayedProducts(selectedPageNumber, paginateValue);
    var finalValue   = this.getFinalValueOfDisplayedProducts(selectedPageNumber, paginateValue);
    var filteredProducts = this.filteredProducts || $('.productGrid');
    $('.productGrid').hide();
    filteredProducts.slice(initialValue, finalValue).show();
  },

  compareFunction: function(a, b) {
    return (a > b) ? 1 : (a < b) ? -1 : 0;
  },

  sortProducts: function($allProducts) {
    var selectedSortOption = $('.sortOption').val();
    $allProducts.sort(this.sorterFunction(selectedSortOption));
    $('#productsContainer').empty();
    $('#productsContainer').append($allProducts);
    return $allProducts;
  },

  sorterFunction: function(selectedSortOption) {
    var obj = this;
    if (selectedSortOption == "data-sold-out") {
      return function(a,b) {
        a = parseInt($(a).attr(selectedSortOption));
        b = parseInt($(b).attr(selectedSortOption));
        return obj.compareFunction(a, b);
      }
    }

    else {
      return function(a,b) {
        a = $(a).attr(selectedSortOption);
        b = $(b).attr(selectedSortOption);
        return obj.compareFunction(a, b);
      }
    }
  },

  sortOptionListener: function(selectedSortOption) {
    var filteredProducts = this.filteredProducts || $('.productGrid');
    var paginateValue = $('.paginateOption').val();
    var sortedProducts = this.sortProducts(filteredProducts);
    this.showFilteredProducts(sortedProducts, paginateValue);
  },

  showFilteredProducts: function(filteredProducts, paginateValue) {
    $('.productGrid').hide();
    $('.page-numbers:first').addClass('highlight').siblings('.page-numbers').removeClass('highlight');
    $(filteredProducts).slice(0, paginateValue).show();
  }
}

$(document).ready(function() {
  var productGrid = new ProductGrid();
})