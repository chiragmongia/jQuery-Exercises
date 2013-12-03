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
    $('li.tabs').bind('click', function() {
      $currentLi = $(this);
      $('li.tabs').removeClass('current');
      $('div.module').hide();
      $('#' + $currentLi.attr('data-module-id')).show();
      $currentLi.addClass('current');
    });
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
      var newListItem = $('<li class="tabs"></li>').attr('data-module-id', $(this).attr('id'));
      newListItem.append($(this).find('h2').html());
      newListItem.appendTo(obj.newUnorderedList);
    })
  },
}

var tabbedNavigation = new TabbedNavigation();