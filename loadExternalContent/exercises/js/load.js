// Works in Mozilla Firefox only.

var ContentLoading = function() {
  this.init();
}

ContentLoading.prototype = {
  init: function() {
    this.headingLinks = $('h3 a');
    this.insertDivAfterBlogHeading();
    this.addDataToHeadingLinks();
    this.bindEvents();
  },

  bindEvents: function() {
    this.headingLinks.bind('click', function(event) {
      event.preventDefault();
      $(this).data('targetDiv').load('data/blog.html' + ' #' + $(this).attr('data-id'));
    })
  },

  insertDivAfterBlogHeading: function() {
   this.headingLinks.each(function() {
      var $divElement = $('<div class="blog-content"></div>');
      $(this).data('targetDiv', $divElement );
      $divElement.insertAfter($(this).closest('h3'));
    });
  },

  addDataToHeadingLinks: function() {
    this.headingLinks.each(function() {
      var tempArray,
          id;
      tempArray = $(this).attr('href').split('#');
      id = '#' + tempArray[1];
      $(this).attr('data-id', id);
    });
  }
}

var contentLoading = new ContentLoading();