var InputHint = function(searchInputField, searchLabel, hintClass) {
  this.searchInputField = $(searchInputField);
  this.searchLabel      = $(searchLabel);
  this.hintClass        = hintClass || 'hint';
  this.init();
}

InputHint.prototype = {
  init: function() {
    this.setSearchInput();
    this.addClasstoSearchInput();
    this.removeSearchLabel();
    this.bindEvents();
  },

  bindEvents: function() {
    var obj = this;
    this.searchInputField.bind({
      // Bind a focus event to the search input that removes the hint text and the "hint" class
      'focus': function() {
        $(this).attr('value', '').removeClass(obj.hintClass);
      }, 

      'blur': function() {
        obj.restoreInputTextAndClass();
      }
    });
  },

  // Set the value of the search input to the text of the label element
  setSearchInput: function() {
    var $searchLabelText = this.searchLabel.html();
    this.searchInputField.attr('value', $searchLabelText);
  },

  // Add a class of "hint" to the search input
  addClasstoSearchInput: function() {
    this.searchInputField.addClass(this.hintClass);
  },

  // Remove the label element
  removeSearchLabel: function() {
    this.searchLabel.detach();
  },

  // Bind a blur event to the search input that restores the hint text and "hint" class if no search text was entered
  restoreInputTextAndClass: function() {
    if (!this.searchInputField.attr('value')) {
      this.setSearchInput();
      this.addClasstoSearchInput();
    }
  }
}

var hintObject = new InputHint(('input.input_text'), ('#search .search-label'), 'hint');