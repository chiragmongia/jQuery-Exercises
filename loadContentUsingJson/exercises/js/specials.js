var LoadingJsonContent = function() {
  this.init();
}

LoadingJsonContent.prototype = {
  init: function() {
    this.cachedResponse = {};
    this.createDivAfterForm();
    this.createUserDetailsParaElement();
    this.bindEvents();
  },

  bindEvents: function() {
    var obj = this;
    $('.days-select').bind('change', function() {
      if ( $('.days-select').val() ) {
        if ( jQuery.isEmptyObject(obj.cachedResponse) ) {
          $.ajax({
            url:      'data/specials.json',
            type:     'GET',
            dataType: 'json',
            success: function(json) {
              obj.cachedResponse = json;
              successCallback(json);
            },
          });
        }

        else {
          successCallback(obj.cachedResponse);
        }
      }
    });

    function successCallback(json) {
      $('.user-details-container').show();
      obj.populateUserDetailsParaElement(json[$('.days-select').val()].title, json[$('.days-select').val()].text, json[$('.days-select').val()].image, json[$('.days-select').val()].color);
      obj.removeFormSubmitBtn();
    }
  },

  createDivAfterForm: function() {
    var $userDetailsDivElement =  $('<div class="user-details-container"></div>');
    $userDetailsDivElement.insertAfter('.user-details-form');
    $('.user-details-container').append($('<p class="user-data"></p>'));
  },

  createUserDetailsParaElement: function() { 
    $('.user-data').append($('<p id="title"></p>'));
    $('.user-data').append($('<p id="text"></p>'));
    $('.user-data').append($('<p id="image">Image: <img/></p>'));
    $('.user-data').append($('<p id="color"></p>'));
  },

  populateUserDetailsParaElement: function(title, text, image, color) {
    $('#title').text('Title: ' + title);
    $('#text').text('Text: ' + text);
    $('#image img').attr('src', image);
    $('#color').text('Color: ' + color);
  },

  removeFormSubmitBtn: function() {
    $('.user-details-form').find('.buttons').detach();
  }
}

var loadingJsonContent = new LoadingJsonContent();