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
    $('h3 a').bind('click', function() {
      $(this).removeAttr('href');
      $(this).closest('h3').siblings('div.blog-content').load('data/blog.html' + ' #' + $(this).attr('data-id'));
    })
  },

  insertDivAfterBlogHeading: function() {
    var $divElement = $('<div class="blog-content"></div>');
    $divElement.insertAfter('h3');
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