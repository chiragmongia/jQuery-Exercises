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

  findMaxSelectedOptionsFilter: function() {
    var maxSelectedOptionsFilter = this.filters[0],
        initialCheckCount = 0;

    this.filters.each(function() {
      var checkedOptionsCount = $(this).find('input:checked').length;
      if (checkedOptionsCount > initialCheckCount) {
        maxSelectedOptionsFilter = this;
        initialCheckCount = checkedOptionsCount;
      }
    });

    return maxSelectedOptionsFilter;
  },

  generateFilterStringForMaxSelectedOptionsFilter: function($maxSelectedOptionsFilter) {
    var obj = this;
    var selectedImgContainerArray = [];
    $maxSelectedOptionsFilter.find('input:checked').each(function() {
      obj.generateFilterStringArray(this, '.productGrid', selectedImgContainerArray);
    });
    return selectedImgContainerArray; 
  },

  displayFilteredProducts: function(selectedImgContainerArray) {
    var finalSelectorString = selectedImgContainerArray.join(',');
    if (selectedImgContainerArray.length) {
      $('.productGrid').hide().filter(finalSelectorString).show();
    }
    else {
      $('.productGrid').show();
    }
  },

  generateFilterStringArray: function(checkedCheckBox, filterString, containerArray) {
    var filterName = $(checkedCheckBox).attr('data-filter-name');
    var selectedImgContainerArr = filterString + "[data-" + filterName + "='" + $(checkedCheckBox).attr("data-"+ filterName) + "']";
    containerArray.push(selectedImgContainerArr);
    return containerArray;
  },

  showAllProductsIfNoCheckedCheckbox: function() {
    var checkedCheckBoxCount = $('.checkbox:checked').length;
    if (checkedCheckBoxCount == 0) {
      $('.productGrid').show();
      return true;
    }
    return false;
  },

  filterData: function() {

    if (this.showAllProductsIfNoCheckedCheckbox()) {
      return;
    }

    var that = this;
    var $maxSelectedOptionsFilter = $(this.findMaxSelectedOptionsFilter()),
        selectedImgContainerArray = [];

    selectedImgContainerArray = this.generateFilterStringForMaxSelectedOptionsFilter($maxSelectedOptionsFilter);
    $maxSelectedOptionsFilter.siblings('.filter').each(function() {
      var finalSelectorArray = [];
      $(this).find('input:checked').each(function() {
        var obj = this;
        $(selectedImgContainerArray).each(function() {
          that.generateFilterStringArray(obj, this, finalSelectorArray);
        })
      })

      if (finalSelectorArray.length) {
        selectedImgContainerArray = finalSelectorArray;
      }
    })

    this.displayFilteredProducts(selectedImgContainerArray);
  }
}

$(document).ready(function() {
  var productGrid = new ProductGrid();
})