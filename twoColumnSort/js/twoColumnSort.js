var TwoColumnSorting = function(sourceListBlock) {
  this.sourceListBlock = $(sourceListBlock);
  this.init();
}

TwoColumnSorting.prototype = {
  init: function() {
    this.sortableItemsList = this.sourceListBlock.children('li');
    this.createUnorderedList(this.sourceListBlock);
    var $rightSideListBlock = this.sourceListBlock.siblings('.dynamicUlContainer').find('.rightUl');
    this.displayDefaultView(this, $rightSideListBlock);
    this.bindEvents($rightSideListBlock);
  },

  bindEvents: function($rightSideListBlock) {
    this.seeMoreListener($rightSideListBlock);
    this.seeLessListener($rightSideListBlock);
  },

  seeMoreListener: function($rightSideListBlock) {
    var obj = this;
    $rightSideListBlock.delegate('#seeMoreLink', 'click', function() {
      var listCountOnEachSide = Math.round((obj.sortableItemsList.length)/2);
      obj.displayList(obj, listCountOnEachSide);
      obj.appendSeeLessLink($rightSideListBlock);
    })
  },

  seeLessListener: function($rightSideListBlock) {
    var obj = this;
    $rightSideListBlock.delegate('#seeLessLink', 'click', function() {
      obj.displayDefaultView(obj, $rightSideListBlock);
    })
  },

  displayList: function(obj, listCountOnEachSide) {
    var $sortedListItems = obj.sortList(obj.sortableItemsList);
    var $displayedItems = obj.getItemsToBeDisplayed($sortedListItems, listCountOnEachSide);
    var $leftSideList = obj.getLeftSideList($displayedItems, listCountOnEachSide);
    var $rightSideList = obj.getRightSideList($displayedItems, listCountOnEachSide);
    obj.appendListsToRespectiveBlocks($leftSideList, $rightSideList);
  },

  displayDefaultView: function(obj, $rightSideListBlock) {
    var initialListCount = obj.getInitialListCount(obj.sourceListBlock);
    obj.displayList(obj, initialListCount);
    obj.appendSeeMoreLink($rightSideListBlock);
  },

  appendListsToRespectiveBlocks: function($leftSideList, $rightSideList) {
    this.appendListItemsToListBlock($leftSideList, ('.leftUl'));
    this.appendListItemsToListBlock($rightSideList, ('.rightUl'));
  },

  appendListItemsToListBlock: function($list, listBlock) {
    this.sourceListBlock.siblings('.dynamicUlContainer').find(listBlock).empty().append($list);
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

  compareValues: function(a, b) {
    return (a > b) ? 1 : (a < b) ? -1 : 0;
  },

  getPriorityOrder: function(element) {
    return parseInt($(element).attr('data-priority-order'));
  },

  sortByPriorityOrder: function(a, b) {
    a = this.getPriorityOrder(a);
    b = this.getPriorityOrder(b);
    return this.compareValues(a, b);
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