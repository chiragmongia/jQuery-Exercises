var SortingListItems =  function() {
  this.init();
}

SortingListItems.prototype = {
  init: function() {
    this.sortableContainers = $('.priority-sort');
    this.appendSeeAllLink(this.sortableContainers);
    this.displayContainerWithPrioritySort();
    this.bindEvents();
  },

  bindEvents: function() {
    var obj = this;
    $('.expandLi').show().end().delegate('.expandLinks', 'click', function() {
      obj.expandContainer(this);
      obj.sortByName(this);
    });

    $('.contractLi').hide().end().delegate('.contractLinks', 'click', function() {
      obj.contractContainer(this);
      obj.sortByPriority(this);
    })
  },

  sortByPriority: function(seeLessLink) {
    var obj = this;
    var $listContainer = $(seeLessLink).closest('ul');
    var $listItems = $listContainer.find('li:not(.linksContainer)');
    $listItems.sort(function(a, b) {
      return obj.sortByPriorityOrder(a, b);
    })
    this.displayResult($listContainer, $listItems);
  },

  sortByName: function(seeAllLink) {
    var obj = this;
    var $listContainer = $(seeAllLink).closest('ul'); 
    var $listItems = $listContainer.find('li') ;
    $listItems.sort(function(a, b) {
      return obj.sortByLiValues(a, b);
    })
    this.displayResult($listContainer, $listItems);
  },

  contractContainer: function(seeLessLink) {
    var $listContainer = $(seeLessLink).closest('ul');
    this.showTillMaxVisibleLi($listContainer, parseInt($listContainer.attr('data-initial-list-count')))
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

  sortByPriorityOrder: function(a, b) {
    a = parseInt($(a).attr('data-priority-order'));
    b = parseInt($(b).attr('data-priority-order'));
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

  displayResult: function($listContainer, $sortedListItems) {
    var $links = $listContainer.find('.linksContainer');
    $listContainer.empty();
    $listContainer.append($sortedListItems);
    $listContainer.append($links);
  },

  displaySortedList: function($listContainer, $sortedListItems) {
    var $listWithoutPriorityOrder = $listContainer.find('li:not(li[data-priority-order])')
    $listContainer.empty();
    $listContainer.append($sortedListItems);
    $listContainer.append($listWithoutPriorityOrder);
  },

  showTillMaxVisibleLi: function(listContainer, maxValue) {
    $(listContainer).each(function(){ 
      $(this).find('li:gt(' + (maxValue-1)  + ')').hide();
    })
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
      obj.showTillMaxVisibleLi(this, parseInt($this.attr('data-initial-list-count')));
    })
  },
}

$(document).ready(function() {
  var sortingListItems = new SortingListItems();
})