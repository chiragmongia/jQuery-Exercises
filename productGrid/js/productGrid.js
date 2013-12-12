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
      dataType: 'text',
      success: function(json) {
        createStoreFrontPage(json);
      },
      error: function(xhr, status) {
        alert("PROBLEM");
      }
    });

    function createStoreFrontPage(json) {
      var json = JSON.parse(json);
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
        checkCount = 0;

    this.filters.each(function() {
      var checkedOptions = $(this).find('input:checked').length;
      if (checkedOptions > checkCount) {
        maxSelectedOptionsFilter = this;
        checkCount = checkedOptions;
      }
    });

    return maxSelectedOptionsFilter;
  },

  generateFilterStringForMaxSelectedOptionsFilter: function($maxSelectedOptionsFilter) {
    var selectedImgContainerArray = [];
    $maxSelectedOptionsFilter.find('input:checked').each(function() {
      var selectedImgContainer = "",
          filterName;

      filterName = $(this).attr('data-filter-name');
      selectedImgContainer = ".productGrid[data-" + filterName + "='" + $(this).attr("data-"+ filterName) + "']";
      selectedImgContainerArray.push(selectedImgContainer);
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

  filterData: function() {
    var $maxSelectedOptionsFilter = $(this.findMaxSelectedOptionsFilter()),
        selectedImgContainerArray = [];

    selectedImgContainerArray = this.generateFilterStringForMaxSelectedOptionsFilter($maxSelectedOptionsFilter);
    $maxSelectedOptionsFilter.siblings('.filter').each(function() {
      var finalSelectorArray = [];
      $(this).find('input:checked').each(function() {
        var obj = this;
        $(selectedImgContainerArray).each(function() {
          var filterName = $(obj).attr('data-filter-name');
          var finalSelector = this + "[data-" + filterName + "='" + $(obj).attr("data-"+ filterName) + "']";
          finalSelectorArray.push(finalSelector);
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