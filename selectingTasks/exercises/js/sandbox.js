var $divClassModule;
console.log("1.")
console.log($divClassModule = $('div.module'));

var $thirdmyListItem;
console.log("2.")
console.log($thirdmyListItem = $('#myList li').eq(2));
console.log($thirdmyListItem = $('#myListItem')); // Best method because it directly searches the elements by Id.
console.log($thirdmyListItem = $('#myList li').filter("#myListItem"));

var $searchLabel;
console.log("3.")
console.log($searchLabel = $('label[for = "q"]'));

var $hiddenElements;
console.log("4.")
console.log($hiddenElements = $('body:hidden').length);

var $imageWithAltAttr;
console.log("5.")
console.log($imageWithAltAttr = $('img[alt]'));

var $tableOddRows;
console.log("6.")
console.log($tableOddRows = $('tr:odd'));