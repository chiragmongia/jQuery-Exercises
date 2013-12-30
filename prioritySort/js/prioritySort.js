var SortingListItems =  function(sortableListBlock) {
  this.sortableListBlock = $(sortableListBlock);
  this.init();
}

SortingListItems.prototype = {
  init: function() {
    this.appendDynamicListHeader();
    this.appendSeeAllLink(this.sortableListBlock);
    this.headerContainer = $('.dynamicHeader');
    this.displayContainerWithPrioritySort();
    this.bindEvents();
  },

  createHeaderElements: function() {
    var $alphaSortBtn    = $('<input>', {'type': 'button','name': 'alphaSort' ,'class': 'alphaSortBtn sortType sortButton', 'value': 'Alpha Sort', 'data-sort-info': 'sortType'});
    var $prioritySortBtn = $('<input>', { 'type': 'button','name': 'prioritySort', 'class': 'prioritySortBtn sortType sortButton', 'value': 'Priority Sort', 'data-sort-info': 'sortType' });
    var $ascendingBtn    = $('<input>', {'type': 'button','name': 'ascending' ,'class': 'ascendingBtn sortOrder sortButton', 'value': 'Ascending',  'data-sort-info': 'sortOrder'});
    var $descendingBtn   = $('<input>', {'type': 'button','name': 'descending' ,'class': 'descendingBtn sortOrder sortButton', 'value': 'Descending','data-sort-info': 'sortOrder'});
    var $headerDiv       = $('<div />', {'class': 'dynamicHeader'});
    $headerDiv.append($alphaSortBtn);
    $headerDiv.append($prioritySortBtn);
    $headerDiv.append($ascendingBtn);
    $headerDiv.append($descendingBtn);
    return $headerDiv;
  },

  appendDynamicListHeader: function() {
    var $dynamicHeader = this.createHeaderElements();
    $dynamicHeader.insertBefore(this.sortableListBlock);
  },

  bindEvents: function() {
    this.seeAllListener();
    this.seeLessListener();
    this.sortButtonListener();
  },

  getListContainer: function(button) {
    return $(button).parent('.dynamicHeader').next('ul')
  },

  reversedListItems: function($sortedListItems) {
    var reversedListItems = [];
    $sortedListItems.each(function() {
      reversedListItems.push(this);
    })
    return reversedListItems.reverse();
  },

  sortButtonListener: function() {
    var obj = this;
    this.headerContainer.delegate('.sortButton', 'click', function() {
      var $this = $(this);
      var sortInfo = $this.attr('data-sort-info');
      $this.addClass('highlight').siblings('.' + sortInfo).removeClass('highlight');
      var selectedSortType = $(this).parent().find('.highlight')[0];
      var selectedSortOrder = $(this).parent().find('.highlight')[1];
      obj.sortList(selectedSortType, selectedSortOrder);
    })
  },

  sortList: function(selectedSortTypeButton, selectedSortOrderButton) {
    var selectedSortType = $(selectedSortTypeButton).attr('name');
    var selectedSortOrder = $(selectedSortOrderButton).attr('name');
    var $listContainer = this.getListContainer(selectedSortTypeButton);

    if (selectedSortType == 'alphaSort') {
      var $sortedListItems = this.sortByName($listContainer);
    }

    else {
      var $listWithoutPriorityOrder = $listContainer.find('li:not(li[data-priority-order])');
      var $sortedListItems = this.sortByPriority($listContainer);
    }

    if (selectedSortOrder == 'ascending') {
      this.displayListAfterSort($listContainer, $sortedListItems);
    }

    else {
      var reversedListItems = this.reversedListItems($sortedListItems);
      this.displayListAfterSort($listContainer, $(reversedListItems));
    }
    this.appendWithoutPriorityOrderList($listContainer, $listWithoutPriorityOrder);
  },

  seeAllListener: function() {
    var obj = this;
    $('.expandLi').show().end().delegate('.expandLinks', 'click', function() {
      obj.expandContainer(this);
      var $listContainer = $(this).closest('ul');
      obj.appendSeeLessLink($listContainer);
      $(this).remove();
    });
  },

  seeLessListener: function() {
    var obj = this;
    $('.contractLi').hide().end().delegate('.contractLinks', 'click', function() {
      var $listContainer = $(this).closest('ul');
      obj.displayTillInitialListCount($listContainer, obj.getInitialListCount($listContainer));
      obj.appendSeeAllLink($listContainer);
      $(this).remove();
    });
  },

  sortByName: function($listContainer) {
    var obj = this;
    var $listItems = $listContainer.find('li');
    $listItems.sort(function(a, b) {
      return obj.sortByLiValues(a, b);
    })
    return $listItems;
  },

  sortByPriority: function($listContainer) {
    var obj = this;
    var $listWithoutPriorityOrder = $listContainer.find('li:not(li[data-priority-order])');
    var $listItems = $listContainer.find('li[data-priority-order]');
    $listItems.sort(function(a, b) {
      return obj.sanitizeValues(a, b);
    })
    return $listItems;
  },

  appendWithoutPriorityOrderList: function($listContainer, $listWithoutPriorityOrder) {
    $listContainer.append($listWithoutPriorityOrder);
  },

  expandContainer: function(seeAllLink) {
    $(seeAllLink).parent('li').siblings('li').show();
  },

  createSeeLessLink: function() {
    var $seeLessLi = $('<li />', { 'class': 'contractLi linksContainer' });
    var $seeLessLink = $('<a />', { 'class': 'contractLinks', 'text': 'See Less' });
    $seeLessLink.appendTo($seeLessLi);
    return $seeLessLi;
  },

  sortByLiValues: function(a, b) {
    a = a.textContent;
    b = b.textContent;
    return this.compareFunction(a, b);
  },

  appendSeeLessLink: function($listContainer) {
    var $seeLessLi = this.createSeeLessLink();
    $seeLessLi.appendTo($listContainer);
  },

  compareFunction: function(a, b) {
    return (a > b) ? 1 : (a < b) ? -1 : 0;
  },

  getPriorityOrder: function(element) {
    return parseInt($(element).attr('data-priority-order'));
  },

  sanitizeValues: function(a, b) {
    a = this.getPriorityOrder(a);
    b = this.getPriorityOrder(b);
    return this.compareFunction(a, b);
  },

  createSeeAllLink: function() {
    var $seeAllLi = $('<li />', { 'class': 'expandLi linksContainer' });
    var $seeAllLink = $('<a />', { 'class': 'expandLinks', 'text': 'See All' });
    $seeAllLink.appendTo($seeAllLi);
    return $seeAllLi;
  },

  appendSeeAllLink: function($listContainer) {
    var $seeAllLi = this.createSeeAllLink();
    $seeAllLi.appendTo($listContainer);
  },

  displayListAfterSort: function($listContainer, $sortedListItems) {
    var $links = $listContainer.find('.linksContainer');
    $listContainer.empty();
    $listContainer.append($sortedListItems);
    $listContainer.append($links);
  },

  displayTillInitialListCount: function($listContainer, maxValue) {
    $listContainer.find('li:gt(' + (maxValue-1)  + ')').hide();
  },

  getInitialListCount: function($listContainer) {
    return parseInt($listContainer.attr('data-initial-list-count'));
  },

  displaySortedList: function($listContainer, $sortedListItems) {
    var $listWithoutPriorityOrder = $listContainer.find('li:not(li[data-priority-order])')
    $listContainer.empty();
    $listContainer.append($sortedListItems);
    $listContainer.append($listWithoutPriorityOrder);
  },

  displayContainerWithPrioritySort: function() {
    var obj = this;
    this.sortableListBlock.each(function() {
      var $this = $(this);
      var $listWithPriorityOrder = $this.find('li[data-priority-order]');
      $listWithPriorityOrder.sort(function(a,b) {
        return obj.sanitizeValues(a,b);
      })
      obj.displaySortedList($this, $listWithPriorityOrder);
      obj.displayTillInitialListCount($this, obj.getInitialListCount($this));
      $('.prioritySortBtn').addClass('highlight');
      $('.ascendingBtn').addClass('highlight');
    })
  }
}

$(document).ready(function() {
  $('.priority-sort').each(function(index, value) {
    var sortingListItems = new SortingListItems(value);
  })
})