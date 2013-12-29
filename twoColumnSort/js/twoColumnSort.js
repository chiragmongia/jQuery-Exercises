var TwoColumnSorting = function(sourceListBlock) {
  this.sourceListBlock = $(sourceListBlock);
  this.init();
}

TwoColumnSorting.prototype = {
  init: function() {
    this.listContainer = $('.listContainer');
    this.sortableItemsList = this.sourceListBlock.children('li');
    this.setUpPage();
    this.bindEvents();
  },

  setUpPage: function() {
    this.createUnorderedList(this.sourceListBlock);
    var $sortedListItems = this.sortList(this.sortableItemsList);
    var initialListCount = this.getInitialListCount(this.sourceListBlock);
    var $displayedItems = this.getItemsToBeDisplayed($sortedListItems, initialListCount);
    var $leftSideList = this.getLeftSideList($displayedItems, initialListCount);
    var $rightSideList = this.getRightSideList($displayedItems, initialListCount);
    this.displayList($leftSideList, $rightSideList);
    this.appendSeeMoreLink($rightSideList.parent('ul'));
  },

  bindEvents: function() {
    var $rightSideList = this.sourceListBlock.siblings('.dynamicUlContainer').find('.rightUl');
    this.seeMoreListener($rightSideList);
    this.seeLessListener($rightSideList);
  },

  seeMoreListener: function($rightSideList) {
    var obj = this;
    $rightSideList.delegate('#seeMoreLink', 'click', function() {
      var $sortedListItems = obj.sortList(obj.sortableItemsList);
      var listCountOnEachSide = Math.round(($sortedListItems.length)/2);
      var $displayedItems = obj.getItemsToBeDisplayed($sortedListItems, listCountOnEachSide);
      var $leftSideList = obj.getLeftSideList($displayedItems, listCountOnEachSide);
      var $rightSideList = obj.getRightSideList($displayedItems, listCountOnEachSide);
      obj.displayList($leftSideList, $rightSideList);
      obj.appendSeeLessLink($rightSideList.parent('ul'));
    })
  },

  seeLessListener: function($rightSideList) {
    var obj = this;
    $rightSideList.delegate('#seeLessLink', 'click', function() {
      var $sortedListItems = obj.sortList(obj.sortableItemsList);
      var initialListCount = obj.getInitialListCount(obj.sourceListBlock);
      var $displayedItems = obj.getItemsToBeDisplayed($sortedListItems, initialListCount);
      var $leftSideList = obj.getLeftSideList($displayedItems, initialListCount);
      var $rightSideList = obj.getRightSideList($displayedItems, initialListCount);
      obj.displayList($leftSideList, $rightSideList);
      obj.appendSeeMoreLink($rightSideList.parent('ul'));
    })
  },

  displayList: function($leftSideList, $rightSideList) {
    this.sourceListBlock.siblings('.dynamicUlContainer').find('.leftUl').empty().append($leftSideList);
    this.sourceListBlock.siblings('.dynamicUlContainer').find('.rightUl').empty().append($rightSideList);
  },

  getItemsToBeDisplayed: function($sortedListItems, maxValue) {
    var $displayedItems = $sortedListItems.filter('li:lt(' + ((maxValue*2)-1)  + ')');
    return $displayedItems;
  },

  createUnorderedList: function($sourceListBlock) {
    var $dynamicUlContainer = $('<div />', { 'class': 'dynamicUlContainer' });
    var $leftUl = $('<ul />', { 'class': 'leftUl' });
    var $rightUl = $('<ul />', {'class': 'rightUl'});
    $leftUl.appendTo($dynamicUlContainer);
    $rightUl.appendTo($dynamicUlContainer);
    $dynamicUlContainer.appendTo($sourceListBlock.parent('.listContainer'));
  },

  getInitialListCount: function($listContainer) {
    return parseInt($listContainer.attr('data-initial-count'));
  },

  getRightSideList: function($displayedItems, maxValue) {
    return $displayedItems.filter('li:gt(' + (maxValue-1)  + ')');
  },

  getLeftSideList: function($displayedItems, maxValue) {
    return $displayedItems.filter('li:lt(' + (maxValue)  + ')');
  },

  createSeeMoreLink: function() {
    var $seeMoreLink = $('<a />', {'id': 'seeMoreLink', 'text': 'See More'});
    var $seeMoreLi = $('<li />', {'id': 'seeMoreLi', 'class': 'links'});
    $seeMoreLink.appendTo($seeMoreLi);
    return $seeMoreLi;
  },

  appendSeeMoreLink: function($listContainer) {
    var $seeMoreLi = this.createSeeMoreLink();
    $seeMoreLi.appendTo($listContainer);
  },

  createSeeLessLink: function() {
    var $seeLessLink = $('<a />', {'id': 'seeLessLink', 'text': 'See Less'});
    var $seeLessLi = $('<li />', {'id': 'seeLessLi', 'class': 'links'});
    $seeLessLink.appendTo($seeLessLi);
    return $seeLessLi;
  },

  appendSeeLessLink: function($listContainer) {
    var $seeLessLi = this.createSeeLessLink();
    $seeLessLi.appendTo($listContainer);
  },

  strCompare: function(a, b) {
    return (a > b) ? 1 : (a < b) ? -1 : 0;
  },

  getNumberfromString: function(numberString) {
    return parseInt(numberString);
  },

  sortByPriorityOrder: function(a, b) {
    a = this.getNumberfromString($(a).attr('data-priority-order'));
    b = this.getNumberfromString($(b).attr('data-priority-order'));
    return this.strCompare(a, b);
  },

  sortList: function(sortableItemsList) {
    var obj = this;
    sortableItemsList.sort(function(a, b) {
      return obj.sortByPriorityOrder(a, b);
    });
    return sortableItemsList.clone();
  }
}

$(document).ready(function() {
  var sourceListBlock = $('.two-column-sort').hide();
  sourceListBlock.each(function(index, value) {
    var twoColumnSorting = new TwoColumnSorting(value);
  })
})