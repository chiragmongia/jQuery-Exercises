// Add five new list items to the end of the unordered list #myList.
for (var i = 0; i < 5; i++ ) {
  $('#myList').append($('<li></li>'));
}


// Remove the odd list items
$('ul li:odd').detach();


// Add another h2 and another paragraph to the last div.module
$('div.module:last').append('<h2></h2><p></p>');


// Add another option to the select element; give the option the value "Wednesday"
$('select').append('<option value="wednesday">Wednesday</option>');


// Add a new div.module to the page after the last one; put a copy of one of the existing images inside of it.
$newDiv = $('<div></div>');
$('img:first').clone().appendTo($newDiv);
$newDiv.insertAfter($('div.module:last'));