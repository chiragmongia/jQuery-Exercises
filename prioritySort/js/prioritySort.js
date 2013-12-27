var SortingListItems =  function() {
  this.init();
}

SortingListItems.prototype = {
  init: function() {
    this.sortableContainers = $('.priority-sort');
    this.appendDynamicListHeader(this.sortableContainers);
    this.appendSeeAllLink(this.sortableContainers);
    this.headerContainer = $('.dynamicHeader');
    this.displayContainerWithPrioritySort();
    this.bindEvents();
  },

  createHeaderElements: function() {
    var $alphaSortBtn = $('<input>', {'type': 'button','name': 'alphaSort' ,'class': 'alphaSortBtn sortOption', 'value': 'Alpha Sort'});
    var $prioritySortBtn = $('<input>', { 'type': 'button','name': 'prioritySort', 'class': 'prioritySortBtn sortOption', 'value': 'Priority Sort' });
    var $ascendingBtn = $('<input>', {'type': 'button','name': 'ascending' ,'class': 'ascendingBtn sortOrder', 'value': 'Ascending'});
    var $descendingBtn = $('<input>', {'type': 'button','name': 'descending' ,'class': 'descendingBtn sortOrder', 'value': 'Descending'});
    var $headerDiv = $('<div />', {'class': 'dynamicHeader'});
    $headerDiv.append($alphaSortBtn);
    $headerDiv.append($prioritySortBtn);
    $headerDiv.append($ascendingBtn);
    $headerDiv.append($descendingBtn);
    return $headerDiv;
  },

  appendDynamicListHeader: function($sortableListContainer) {
    var $dynamicHeader = this.createHeaderElements();
    $dynamicHeader.insertBefore($sortableListContainer);
  },

  bindEvents: function() {
    this.seeAllListener();
    this.seeLessListener();
    this.prioritySortBtnListener();
    this.alphaSortBtnListener();
    this.ascendingBtnListener();
    this.descendingBtnListener();
  },

  getListContainer: function(button) {
    return $(button).parent('.dynamicHeader').next('ul')
  },

  getSortingInfo: function(clickedbutton) {
    return $(clickedbutton).siblings('.highlightBtn').attr('name')
  },

  reversedListItems: function($sortedListItems) {
    var reversedListItems = [];
    $sortedListItems.each(function() {
      reversedListItems.push(this);
    })
    return reversedListItems.reverse();
  },

  descendingBtnListener: function($sortedListItems) {
    var obj = this;
    this.headerContainer.delegate('.descendingBtn', 'click', function() {
      obj.highlightBtn(this, 'sortOrder');
      var $listContainer = obj.getListContainer(this);

      var selectedSortOption = obj.getSortingInfo(this);
      if (selectedSortOption == 'prioritySort') {
        var $listWithoutPriorityOrder = $listContainer.find('li:not(li[data-priority-order])');
        var $sortedListItems = obj.sortByPriority($listContainer);
        var reversedListItems = obj.reversedListItems($sortedListItems);
        obj.displayListAfterSort($listContainer, $(reversedListItems));
        obj.appendWithoutPriorityOrderList($listContainer, $listWithoutPriorityOrder);
      }

      else if (selectedSortOption == 'alphaSort') {
        var $sortedListItems = obj.sortByName($listContainer);
        var reversedListItems = obj.reversedListItems($sortedListItems);
        obj.displayListAfterSort($listContainer, $(reversedListItems));
      }
    })
  },

  ascendingBtnListener: function($sortedListItems) {
    var obj = this;
    this.headerContainer.delegate('.ascendingBtn', 'click', function() {
      var $this = $(this);
      obj.highlightBtn(this, 'sortOrder');
      var $listContainer = obj.getListContainer(this);

      var selectedSortOption = obj.getSortingInfo(this);
      if (selectedSortOption == 'prioritySort') {
        var $listWithoutPriorityOrder = $listContainer.find('li:not(li[data-priority-order])');
        var $sortedListItems = obj.sortByPriority($listContainer);
        obj.displayListAfterSort($listContainer, $sortedListItems);
        obj.appendWithoutPriorityOrderList($listContainer, $listWithoutPriorityOrder);
      }

      else if (selectedSortOption == 'alphaSort') {
        var $sortedListItems = obj.sortByName($listContainer);
        obj.displayListAfterSort($listContainer, $sortedListItems);
      }
    })
  },

  prioritySortBtnListener: function() {
    var obj = this;
    this.headerContainer.delegate('.prioritySortBtn', 'click', function() {
      obj.highlightBtn(this, 'sortOption');
      var $listContainer = obj.getListContainer(this);
      var $listWithoutPriorityOrder = $listContainer.find('li:not(li[data-priority-order])');
      var $sortedListItems = obj.sortByPriority($listContainer);
      var selectedSortOrder = obj.getSortingInfo(this);
      
      if(selectedSortOrder == 'ascending') {
        obj.displayListAfterSort($listContainer, $sortedListItems);
      }

      else if (selectedSortOrder == 'descending') {
        var reversedListItems = obj.reversedListItems($sortedListItems);
        obj.displayListAfterSort($listContainer, $(reversedListItems));  
      }
      obj.appendWithoutPriorityOrderList($listContainer, $listWithoutPriorityOrder);
    })
  },

  alphaSortBtnListener: function() {
    var obj = this;
    this.headerContainer.delegate('.alphaSortBtn', 'click', function() {
      obj.highlightBtn(this, 'sortOption');
      var $listContainer = obj.getListContainer(this);
      var selectedSortOrder = obj.getSortingInfo(this);
      var $sortedListItems = obj.sortByName($listContainer);

      if(selectedSortOrder == 'ascending') {
        obj.displayListAfterSort($listContainer, $sortedListItems);
      }

      else if (selectedSortOrder == 'descending') {
        var reversedListItems = obj.reversedListItems($sortedListItems);
        obj.displayListAfterSort($listContainer, $(reversedListItems));
      }
    })
  },

  highlightBtn: function(button, className) {
    $(button).addClass('highlightBtn').siblings('.' + className).removeClass('highlightBtn');
  },

  seeAllListener: function() {
    var obj = this;
    $('.expandLi').show().end().delegate('.expandLinks', 'click', function() {
      obj.expandContainer(this);
    });
  },

  seeLessListener: function() {
    var obj = this;
    $('.contractLi').hide().end().delegate('.contractLinks', 'click', function() {
      obj.contractContainer(this);
    });
  },

  sortByName: function($listContainer) {
    var obj = this;
    var $listItems = $listContainer.find('li') ;
    $listItems.sort(function(a, b) {
      return obj.sortByLiValues(a, b);
    })
    return $listItems;
  },

  sortByPriority: function($listContainer) {
    var obj = this;
    var $listItems = $listContainer.find('li[data-priority-order]');
    $listItems.sort(function(a, b) {
      return obj.sortByPriorityOrder(a, b);
    })
    return $listItems;
  },

  appendWithoutPriorityOrderList: function($listContainer, $listWithoutPriorityOrder) {
    $listContainer.append($listWithoutPriorityOrder);
  },

  contractContainer: function(seeLessLink) {
    var $listContainer = $(seeLessLink).closest('ul');
    this.displayTillInitialListCount($listContainer, this.getInitialListCount($listContainer));
    $(seeLessLink).hide();
    this.appendSeeAllLink($listContainer);
  },

  expandContainer: function(seeAllLink) {
    var $listContainer = $(seeAllLink).closest('ul');
    $(seeAllLink).parent('li').siblings('li').show();
    $(seeAllLink).hide();
    this.appendSeeLessLink($listContainer);
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
    return this.strCompare(a, b);
  },

  appendSeeLessLink: function($listContainer) {
    var $seeLessLi = this.createSeeLessLink();
    $seeLessLi.appendTo($listContainer);
  },

  strCompare: function(a, b) {
    return (a > b) ? 1 : (a < b) ? -1 : 0;
  },

  getIntegerValues: function(numberString) {
    return parseInt(numberString);
  },

  sortByPriorityOrder: function(a, b) {
    a = this.getIntegerValues($(a).attr('data-priority-order'));
    b = this.getIntegerValues($(b).attr('data-priority-order'))
    return this.strCompare(a, b);
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

  displayTillInitialListCount: function(listContainer, maxValue) {
    $(listContainer).each(function() {
      $(this).find('li:gt(' + (maxValue-1)  + ')').hide();
    })
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
    this.sortableContainers.each(function() {
      var $this = $(this);
      var $listWithPriorityOrder = $this.find('li[data-priority-order]');
      $listWithPriorityOrder.sort(function(a,b) {
        return obj.sortByPriorityOrder(a,b);
      })
      obj.displaySortedList($this, $listWithPriorityOrder);
      obj.displayTillInitialListCount(this, obj.getInitialListCount($this));
      obj.highlightBtn($('.prioritySortBtn'), 'sortOption');
      obj.highlightBtn($('.ascendingBtn'), 'sortOrder');
    })
  },
}

$(document).ready(function() {
  var sortingListItems = new SortingListItems();
})