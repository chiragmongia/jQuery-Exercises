var InputHint = function() {
  this.init();
}

InputHint.prototype = {
  init: function() {
    this.searchInputField = $('input.input_text');
    this.searchLabel      = $('#search label');
    this.setSearchInput();
    this.addClasstoSearchInput();
    this.removeSearchLabel();
    this.bindEvents();
  },

  bindEvents: function() {
    var obj = this;
    this.searchInputField.bind({
      'focus': this.removeInputTextAndClass,
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
    this.searchInputField.addClass('hint');
  },

  // Remove the label element
  removeSearchLabel: function() {
    this.searchLabel.detach();
  },

  // Bind a focus event to the search input that removes the hint text and the "hint" class
  removeInputTextAndClass: function() {
    $(this).attr('value', '').removeClass('hint');
  },

  // Bind a blur event to the search input that restores the hint text and "hint" class if no search text was entered
  restoreInputTextAndClass: function() {
    if (!this.searchInputField.attr('value')) {
      this.setSearchInput();
      this.addClasstoSearchInput();
    }
  }
}

var hint = new InputHint();