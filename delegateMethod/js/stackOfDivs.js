var DynamicDiv = function(wrapperDiv) {
  this.containerDiv = $(wrapperDiv);
  this.init();
}

DynamicDiv.prototype = {
  init: function() {
    this.divCounter = 0;
    this.bindEvents();
  },

  bindEvents: function() {
    var obj = this;

    // Using bind() for static element
    $('#addBtn').bind('click', function() {
      var $divElement = $('<div class="container-children"></div>');
      $divElement.text(++obj.divCounter);
      $divElement.attr('data-div-number', obj.divCounter);
      obj.containerDiv.append($divElement);
    });

    // Using delegate() for dynamic elements because live() has been deprecated from jQuery 1.7
    this.containerDiv.delegate('.container-children', 'click', function() {
      if (parseInt($(this).attr('data-div-number')) == obj.divCounter) {
        $(this).detach();
        --obj.divCounter;
      }

      $(this).addClass('highlight');
    });
  },
}

var dynamicDivObject = new DynamicDiv(('#div-container'));