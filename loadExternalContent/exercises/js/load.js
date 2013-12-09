// Works in Mozilla Firefox only.

var ContentLoading = function() {
  this.init();
}

ContentLoading.prototype = {
  init: function() {
    this.insertDivAfterBlogHeading();
    this.addDataToHeadingLinks();
    this.bindEvents();
  },

  bindEvents: function() {
    $('h3 a').bind('click', function(event) {
      event.preventDefault();
      $('#' + $(this).attr('targetDiv')).load('data/blog.html' + ' #' + $(this).attr('data-id'));
    })
  },

  insertDivAfterBlogHeading: function() {
    var $divElement = $('<div class="blog-content"></div>');
    $divElement.insertAfter('h3');
    $('.blog-content').each(function(index) {
      $(this).attr('id', index+1);
    })

    $('h3 a').each(function() {
      $(this).attr('targetDiv', $(this).closest('h3').siblings('div.blog-content').attr('id'));
    });
  },

  addDataToHeadingLinks: function() {
    $('h3 a').each(function() {
      var tempArray,
          id;
      tempArray = $(this).attr('href').split('#');
      id = '#' + tempArray[1];
      $(this).attr('data-id', id);
    });
  }
}

var contentLoading = new ContentLoading();