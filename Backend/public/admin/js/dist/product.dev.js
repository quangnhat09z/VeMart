"use strict";

// Change-Status
var statusElements = document.querySelectorAll('[button-change-status]'); // console.log(statusElements);

if (statusElements.length > 0) {
  var formChangeStatus = document.getElementById('changeStatusForm');
  var path = formChangeStatus.getAttribute('data-path'); // console.log(path);

  statusElements.forEach(function (element) {
    element.addEventListener('click', function () {
      var currentStatus = this.getAttribute('data-status');
      var id = this.getAttribute('data-id');
      var newStatus = currentStatus == "active" ? "inactive" : "active";
      var action = path + "/".concat(newStatus, "/").concat(id) + "?_method=PATCH";
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}