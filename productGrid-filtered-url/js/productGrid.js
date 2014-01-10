var ProductGrid = function() {
  this.init();
}

ProductGrid.prototype = {
  init: function() {
    this.filters = $('.filter');
    this.container = $('#container');
    this.sortOption = $('.sortOption');
    this.paginateOption = $('.paginateOption');
    this.fetchJsonData();
    this.bindEvents();
    this.readFilePath();
  },

  readFilePath: function() {
    var hashValue = window.location.hash;
    if (hashValue) {
      var filterString = hashValue.split('#')[1];
      var filters = filterString.split('&');
      for (var i = 0; i < filters.length; i++) {
        var filterValues = filters[i].split('=');
        if (filterValues[1]) {
          if (filterValues[0] == 'pg')
            $('.page-numbers')[filterValues[1]-1].click();
          else {
            var selectedValue = filterValues[1].split(',');
            for ( var j = 0; j < selectedValue.length; j++ ) {
              $("input[value='" + selectedValue[j] + "']").click();
            }
          }
          this.setPaginateAndSort(filterValues);
        }
      }
    }
  },

  setPaginateAndSort: function(filterValues) {
    if (filterValues[0] == 'paginate') {
      this.paginateOption.val(filterValues[1]).change();
    }

    if (filterValues[0] == 'sort') {
      this.sortOption.val(filterValues[1]).change();
    }
  },

  bindEvents: function() {
    var urlHashData = {'br': '', 'color': '', 'sold-out': '', 'paginate': '', 'sort': '', 'pg': ''};
    this.filtersListener(urlHashData);
    this.paginationListener(urlHashData);
    this.sortingListener(urlHashData);
  },

  filtersListener: function(urlHashData) {
    var obj = this;
    $('.productFilter').bind('change', function() {
      obj.appendFiltersInUrl(urlHashData, this);
      obj.filterData();
    });
  },

  paginationListener: function(urlHashData) {
    var obj = this;
    this.container.delegate('.page-numbers', 'click', function() {
      $(this).addClass('highlight').siblings('.page-numbers').removeClass('highlight');
      obj.appendFiltersInUrl(urlHashData, this);
      obj.pageNumberListener(this.textContent);
    });
  },

  sortingListener: function(urlHashData) {
    var obj = this;
    this.sortOption.bind('change', function() {
      obj.appendFiltersInUrl(urlHashData, this);
      obj.sortOptionListener(this.value);
    })
  },

  fetchJsonData: function() {
    var obj = this;
    $.ajax({
      url:      'data/productsData.js',
      async:    false,
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
        obj.sortProducts(obj.allProducts);
        obj.createPageFooter(obj.allProducts);
      }
    });

    function createStoreFrontPage(json) {
      for (var i = 0; i < json.length; i++) {
        var $productGrid = $('<div class="productGrid"></div>');
        $productGrid.attr( { 'data-name': json[i].name ,'data-color': json[i].color, 'data-brand': json[i].brand, 'data-sold-out': json[i].sold_out });
        $('<img></img>').attr('src',json[i].url).appendTo($productGrid);
        $productGrid.appendTo($('#productsContainer'));
      }
    }
  },

  appendFiltersInUrl: function(urlHashData, selectedFilter) {
    var $selectedFilter = $(selectedFilter);
    var filterName = $selectedFilter.attr('data-filter-name');
    var $checkedCheckBoxes = $selectedFilter.parent('.filter').find('input:checked');
    if (filterName == 'brand') {
      urlHashData['br'] = '';
      urlHashData['pg'] = '1';
      $checkedCheckBoxes.each(function() {
        urlHashData['br'] += $(this).attr('value') + ',';
      })
    }

    else if (filterName == 'color') {
      urlHashData['color'] = '';
      urlHashData['pg'] = '1';
      $checkedCheckBoxes.each(function() {
        urlHashData['color'] += $(this).attr('value') + ',';
      })
    }

    else if (filterName == 'sold-out') {
      urlHashData['sold-out'] = '';
      $checkedCheckBoxes.each(function() {
        urlHashData['sold-out'] += $(this).attr('value') + ',';
      })
      urlHashData['pg'] = '1';
    }

    else if (filterName == 'pagination') {
      urlHashData['pg'] = '1';
      urlHashData['paginate'] = selectedFilter.value;
    }

    else if (filterName == 'sorting') {
      urlHashData['pg'] = '1';
      urlHashData['sort'] = selectedFilter.value;
    }

    else if (filterName == 'pageNumber') {
      urlHashData['pg'] = selectedFilter.textContent;
    }

    window.location.hash = 'br=' + urlHashData['br'] + '&color=' + urlHashData['color'] + '&sold-out=' + urlHashData['sold-out'] + '&paginate=' + urlHashData['paginate'] + '&sort=' + urlHashData['sort'] + '&pg=' + urlHashData['pg'];
  },

  filterData: function() {
    var obj = this;
    var $sortedProducts = this.sortProducts(this.allProducts);
    this.filters.each(function(index, value) {
      $sortedProducts = obj.filterGroup($sortedProducts, value);
    });
    var selectedSortOption = this.sortOption.val();
    $sortedProducts.sort(this.sorterFunction(selectedSortOption));
    this.filteredProducts = $sortedProducts;
    this.paginateProducts(this.filteredProducts);
  },

  filterGroup: function($filteredProducts, filterContainer) {
    var obj = this;
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
    var paginateValue = this.paginateOption.val();
    var totalPages = this.getTotalPages(filteredProducts, paginateValue);
    this.createPageFooterElements(totalPages);
    this.showFilteredProducts(filteredProducts, paginateValue);
  },

  createPageFooterElements: function(totalPages) {
    var $footerDiv = $('<div />', { 'class': 'footerContainer' });
    for (var i = 0; i < totalPages; i++ ) {
      var $paraElement = $('<p />', { 'class': 'page-numbers', 'text': (i+1), 'data-filter-name': 'pageNumber' });
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
    var paginateValue = this.paginateOption.val();
    var initialValue = this.getInitialValueOfDisplayedProducts(selectedPageNumber, paginateValue);
    var finalValue   = initialValue + parseInt(paginateValue);
    var filteredProducts = this.filteredProducts || this.allProducts;
    this.allProducts.hide();
    filteredProducts.slice(initialValue, finalValue).show();
  },

  compareFunction: function(a, b) {
    return (a > b) ? 1 : (a < b) ? -1 : 0;
  },

  sortProducts: function($allProducts) {
    var selectedSortOption = this.sortOption.val();
    var $productsContainer = $('#productsContainer');
    $allProducts.sort(this.sorterFunction(selectedSortOption));
    $productsContainer.empty();
    $productsContainer.append($allProducts);
    return $allProducts;
  },

  sorterFunction: function(selectedSortOption) {
    var obj = this;
    if (selectedSortOption == 'data-sold-out' || selectedSortOption == 'data-name') {
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
    var filteredProducts = this.filteredProducts || this.allProducts;
    var paginateValue = this.paginateOption.val();
    var sortedProducts = this.sortProducts(filteredProducts);
    this.showFilteredProducts(sortedProducts, paginateValue);
  },

  showFilteredProducts: function(filteredProducts, paginateValue) {
    this.allProducts.hide();
    $('.page-numbers:first').addClass('highlight').siblings('.page-numbers').removeClass('highlight');
    $(filteredProducts).slice(0, paginateValue).show();
  }
}

$(document).ready(function() {
  var productGrid = new ProductGrid();
})