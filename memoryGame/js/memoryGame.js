Array.prototype.rand = function() {
  return this[Math.floor((Math.random()*(this.length-1))+1)];
}

var MemoryGame = function() {
  this.init();
}

MemoryGame.prototype = {
  init: function() {
    this.rowCount = 6;
    this.columnCount = 6;
    this.container = $('#container');
    this.createGrid();
    this.appendImagesToColumns();
    this.setUpTimer();
    this.createTimerBlock();
    this.bindEvents();
  },

  generateTimeString: function(timeInSeconds) {
    var hours = Math.floor(timeInSeconds / 3600);
    timeInSeconds = timeInSeconds % 3600;

    var minutes = Math.floor(timeInSeconds / 60);
    timeInSeconds = timeInSeconds % 60;

    var seconds = Math.floor(timeInSeconds);

    hours = this.prependZeroIfRequired(hours);
    minutes = this.prependZeroIfRequired(minutes);
    seconds = this.prependZeroIfRequired(seconds);

    var currentTimeString = hours + ':' + minutes + ':' + seconds;
    return currentTimeString;
  },

  prependZeroIfRequired: function(num) {
    return ( num < 10 ? '0' : '' ) + num;
  },

  setUpTimer: function() {
    var displayedSeconds = 0;
    var obj = this;
    setInterval(function() {
      displayedSeconds = displayedSeconds + 1;
      $('#timer').text(obj.generateTimeString(displayedSeconds));
    }, 1000);
  },

  createTimerBlock: function() {
    var $timerDiv = $('<div />', { 'id': 'timer' })
    $timerDiv.appendTo(this.container);
  },

  generateRandomImages: function() {
    var imageArray = this.createImageArray();
    imageArray.sort(function() {
      return [0, 1, -1].rand();
    })
    return imageArray;
  },

  appendImagesToColumns: function() {
    var imageArray = this.generateRandomImages();
    $('.gridTableCol').each(function(index) {
      $(this).append($(imageArray[index]).clone());
    })
  },

  bindEvents: function() {
    this.tableTdListener();
  },

  createGrid: function() {
    var $gridContainer = $('<div />', { 'id': 'gridContainer' });
    var $gridTable = $('<table />', { 'id': 'gridTable' });
    $gridTable.appendTo($gridContainer);
    $gridContainer.appendTo(this.container);
    this.createRowsAndCols($gridTable);
  },

  createRowsAndCols: function(gridTable) {
    var counterForAppendingImages = -1;
    for ( var i = 0; i < this.rowCount; i++ ) {
      var $gridTableRow = $('<tr />', { 'class': 'gridTableRow' });
      for ( var j = 0; j < this.columnCount; j++) {
        var $gridTableCol = $('<td />', { 'class': 'gridTableCol' });
        $gridTableCol.appendTo($gridTableRow);
      }
      $gridTableRow.appendTo(gridTable);
    }
  },

  createImageArray: function() {
    var imageArray = [];
    var totalImages = (this.columnCount * this.rowCount);
    for (var i = 0; i < totalImages/2; i++) {
      var image = $('<img></img>', { 'class': 'image', 'src': 'images/image_' + i + '.jpg' });
      imageArray.push(image);
      imageArray.push(image);
    }
    return imageArray;
  },

  tableTdListener: function() {
    var obj = this;
    $('.gridTableRow').delegate('.gridTableCol', 'click', function() {
      obj.addClassClicked($(this));
      obj.matchImages();
      obj.checkIfCompleted();
    })
  },

  checkIfCompleted: function() {
    var $totalImages = $('.image');
    var $matchedImages = $totalImages.filter('.matched');
    if ( $totalImages.length == $matchedImages.length ) {
      alert("You completed in " + $('#timer').text());
      this.resultPage();
    }
  },

  resultPage: function() {
    var $paraElement = $('<p>', { 'class': 'resultText' });
    var resultString = this.generateResultString();
    $paraElement.text(resultString);
    this.container.empty();
    $paraElement.appendTo(this.container);
  },

  generateResultString: function() {
    var totalTimeArr = [];
    var totalTimeArr = $('#timer').text().split(':');
    var resultString = 'You completed the game in ' + totalTimeArr[0] + ' hours, ' + totalTimeArr[1] + ' minutes and ' + totalTimeArr[2] + ' seconds.';
    return resultString;
  },

  addClassClicked: function($obj) {
    if ( !$obj.find('img').hasClass('matched') ) {
      $obj.find('img').show().addClass('clicked');
    }
  },

  matchImages: function() {
    var $clickedImages = $('.clicked');
    if ($clickedImages.length == 2) {
      $('.clicked').removeClass('clicked');
      return this.is_matchFound($clickedImages);
    }
  },

  is_matchFound: function($clickedImages) {
    if ($($clickedImages[0]).attr('src') == $($clickedImages[1]).attr('src')) {
      $clickedImages.addClass('matched');
      return true;
    }

    setTimeout(function() { 
      $clickedImages.hide(); 
    }, 1000);
    return false;
  }
}

$(document).ready(function() {
  $('#startBtn').bind('click', function() {
    var memoryGame = new MemoryGame();
    $('#startPage').hide();
  })
})