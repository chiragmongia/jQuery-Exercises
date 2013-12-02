var TabbedNavigation = function() {
  this.init();
}

TabbedNavigation.prototype = {
  init: function() {
    this.divModule        = $('div.module');
    this.newUnorderedList = $('<ul id="newUl"></ul>');
    this.hideAllDivModules();
    this.createUlBeforeDivModule();
    this.createTabsForNavigation();
    this.bindEvents();
  },

  bindEvents: function() {
    this.newUnorderedList.children().bind('click', this.showCurrentModule);
  },

  hideAllDivModules: function() {
    this.divModule.hide();
  },

  createUlBeforeDivModule: function() {
    this.newUnorderedList.insertBefore(this.divModule.first());
  },

  createTabsForNavigation: function() {
    var obj = this;
    this.divModule.each(function() {
      var newListItem = $('<li></li>');
      newListItem.append($(this).find('h2').html());
      newListItem.appendTo(obj.newUnorderedList);
    })
  },

  showCurrentModule: function() {
    $currentLi = $(this);
    $('div.module').each(function() {
      if ( $currentLi.html().toLowerCase() == $(this).attr('id'))
        $(this).show();
      else
        $(this).hide();
    })

    $currentLi.parent().children().each(function() { 
      $(this).removeClass('current'); 
    });
    
    $currentLi.addClass('current');
  }
}

var tabbedNavigation = new TabbedNavigation();