var RoleManagement = function() {
  this.init();
}

RoleManagement.prototype = {
  init: function() {
    this.container = $('#container');
    this.roles     = ['ROR Developer', 'JS/jQuery', 'Android', 'iOS'];
    this.employees = ['Akhil', 'Hk', 'Rd', 'Alok', 'Waseem'];
    this.createSections();
    this.dragDropEmployeesToRoles();
    this.bindEvents();
  },

  createSections: function() {
    this.createEmployeesSection();
    this.createToDosSection();
    this.createRolesSection();
  },

  bindEvents: function() {
    this.addSlideAnimationInToDosHeadings();
    this.showCrossButtonOnEmployeeHover();
  },

  createEmployeesSection: function() {
    var $employeesContainer = $('<div />', {'class': 'employeesContainer'}),
        $employeesBlock = $('<ul />', {'class': 'employeesBlock'}),
        $employeesSectionHeading = $('<h3 />', {'class': 'employeesSectionHeading','text': 'Employees' });
    
    $employeesSectionHeading.appendTo($employeesContainer);
    $employeesBlock.appendTo($employeesContainer);
    $employeesContainer.appendTo(this.container);

    for(var i = 0; i < this.employees.length; i++) {
      this.createElementsForEmployeesSection($employeesBlock, this.employees[i]);
    }
  },

  createElementsForEmployeesSection: function($employeesBlock, employeeItem) {
    var $employeeListIem = $('<li />', {'id': employeeItem, 'class': 'employeeListItem', 'text': employeeItem });
    $employeeListIem.appendTo($employeesBlock);
  },

  createRolesSection: function() {
    var $rolesContainer = $('<div />', {'class': 'rolesContainer'}),
        $rolesBlock     = $('<ul />', {'class': 'rolesBlock'}),
        $rolesSectionHeading   = $('<h3 />', {'class': 'rolesSectionHeading', 'text': 'Roles'});
        $toDosBlock = $('.toDosBlock');

    $rolesSectionHeading.appendTo($rolesContainer);
    $rolesBlock.appendTo($rolesContainer);
    $rolesContainer.appendTo(this.container);

    for(var i = 0; i < this.roles.length; i++) {
      this.createElementsForRolesSection($rolesBlock, this.roles[i]);
      this.createElementsForToDoSection($toDosBlock, this.roles[i]);
    }
  },

  createElementsForRolesSection: function($rolesBlock, roleItem) {
    var $rolesListIem = $('<li />', {'class': 'rolesListIem'}),
    $rolesHeading = $('<h3 />', {'class': 'rolesHeading', 'text': roleItem }),
    rolesName  = this.getRolesIdByName(roleItem),
    $addedEmployeesBlock = $('<ul />', { 'id': rolesName + 'block', 'class': 'addedEmployeesBlock'});

    $rolesHeading.appendTo($rolesListIem);
    $addedEmployeesBlock.appendTo($rolesListIem);
    $rolesListIem.appendTo($rolesBlock);
  },

  createToDosSection: function() {
    var $toDosContainer = $('<div />', {'class': 'toDosContainer'}),
        $toDosBlock     = $('<ul />', {'class': 'toDosBlock'}),
        $toDosSectionHeading = $('<h3 />', {'class': 'toDosSectionHeading', 'text': 'To Dos'});

    $toDosSectionHeading.appendTo($toDosContainer);
    $toDosBlock.appendTo($toDosContainer);
    $toDosContainer.appendTo(this.container);
  },

  createElementsForToDoSection: function($toDosBlock, roleItem) {
    var $toDosListItem = $('<li />', {'class': 'toDosListItem'}),
        $toDosHeading = $('<h3 />', {'class': 'toDosHeading', 'text': roleItem}),
        $toDosHeadingMinusImg = $('<img />', { 'id': 'minusSignImg', 'src': 'images/minus-sign.png', 'class': 'headingImages'}),
        $toDosHeadingPlusImg = $('<img />', { 'id': 'plusSignImg', 'src': 'images/plus-sign.png', 'class': 'headingImages'}),
        dataRolesId = this.getRolesIdByName(roleItem),
        $employeesToDosBlock = $('<div />', {'class': 'employeesToDosBlock', 'data-roles-id': dataRolesId + 'block'}); 

    $toDosHeadingMinusImg.appendTo($toDosHeading);
    $toDosHeadingPlusImg.appendTo($toDosHeading).hide();
    $toDosHeading.appendTo($toDosListItem);
    $employeesToDosBlock.appendTo($toDosListItem);
    $toDosListItem.appendTo($toDosBlock);
  },

  getRolesIdByName: function(rolesName) {
    var rolesName = rolesName.split(' ').join('');
    return rolesName;
  },

  dragDropEmployeesToRoles: function() {
    var obj = this,
        $employeeListItem = $('.employeeListItem'),
        $addedEmployeesBlock = $('.addedEmployeesBlock');

    $employeeListItem.draggable({ helper: 'clone' });
    $addedEmployeesBlock.droppable();
    $addedEmployeesBlock.each(function() {
      $(this).droppable({
        accept: $employeeListItem,
        drop: function( event, ui ) {
          $this = $(this);
          if (!ui.draggable.hasClass($this.attr('id'))) {
            $employeeListItem.draggable({ revert: false });
            ui.draggable.addClass($this.attr('id'));
            ui.draggable.clone().appendTo($this);
            obj.addEmployeeUnderToDoSection(ui, this);
            obj.addCrossButtonToAddedEmployee($this.find('li:last'));
            obj.crossImageListener();
          }
          else{
            $employeeListItem.draggable({revert: true});
          }
        }
      })
    });
  },

  addEmployeeUnderToDoSection: function(uiObject, rolesBlock) {
    var employeesToDosBlock = $('.employeesToDosBlock'),
        $empToDosContainer = $('<div />', { 'class': 'empToDosContainer' }),
        nameElement = $('<div />',{ 'id': uiObject.draggable.attr('id') + 'ToDos', 'text': uiObject.draggable.attr('id'), 'class': 'addedEmpName' }),
        toDoBlockForEmp = $('<div />', {  'class': 'addedEmpNameBlock', 'id': uiObject.draggable.attr('id') + '_toDosBlockForEmp'});
    
    nameElement.appendTo($empToDosContainer);
    toDoBlockForEmp.appendTo($empToDosContainer);
    for (var i = 0; i < employeesToDosBlock.length; i++) {
      if ( $(employeesToDosBlock[i]).attr('data-roles-id') == $(rolesBlock).attr('id') ) {
        $empToDosContainer.attr('data-id', uiObject.draggable.attr('id') + 'ToDos_' + $(rolesBlock).attr('id'));
        $empToDosContainer.clone().appendTo($(employeesToDosBlock[i]));
      }
    }
  },

  addCrossButtonToAddedEmployee: function(addedEmployeeListItem) {
    var $crossBtnImage = $('<img />', {'src': 'images/wrong-btn-image.png', 'class': 'cross_button'});
    $crossBtnImage.appendTo(addedEmployeeListItem);
  },

  showCrossButtonOnEmployeeHover: function() {
    var $addedEmployeesBlock = $('.addedEmployeesBlock');
    $addedEmployeesBlock.delegate('li', 'mouseenter mouseleave', function(event) {
      var $this = $(this);
      if (event.type === 'mouseenter')
        $this.addClass('highlight').children('img').show();
      else
        $this.removeClass('highlight').children('img').hide();
    })
  },

  crossImageListener: function() {
    var obj = this;
    $('.addedEmployeesBlock li').on('click', '.cross_button', function(event) {
      event.stopImmediatePropagation();
      var $this = $(this);
      var removedEmployeeId = $this.parent('li').attr('id');
      var parentRolesBlockId = $this.closest('ul').attr('id');
      var confirmDeletion = confirm('Are you sure you want to remove ' + removedEmployeeId + ' ?');

      if (confirmDeletion) {
        $('#' + removedEmployeeId).removeClass(parentRolesBlockId);
        $this.parent('li').hide('drop', 1000, function() {
          $this.remove();
        });
        obj.removeEmployeeFromToDosSection(removedEmployeeId, parentRolesBlockId);
      }
    })
  },

  removeEmployeeFromToDosSection: function(removedEmployeeId, parentRolesBlockId) {
    $('.empToDosContainer').each(function() {
      var $this = $(this);
      if ($this.attr('data-id') == (removedEmployeeId + 'ToDos_' + parentRolesBlockId)) {
        $this.hide('drop', 1000, function() {
          $this.remove();
        });
      }
    })
  },

  addSlideAnimationInToDosHeadings: function() {
    var $toDosHeading = $('.toDosHeading');
    $toDosHeading.bind('click', function() {
      var $this = $(this);
      var $visibleImage = $this.find('img:visible');
      $visibleImage.hide().siblings('.headingImages').show();
      $this.siblings('.employeesToDosBlock').slideToggle();
    });
  }
}

$(document).ready(function() {
  var roleManagement = new RoleManagement();
})