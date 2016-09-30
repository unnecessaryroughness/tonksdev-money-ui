$(function() {
    'use strict';

    $(".btn-delete-ag").on("click", function(event) {
        $("#inputId").val($(this).data('groupid'));
    });

    $(".btn-edit-ag").on("click", function(event) {
        appendSubmitForm('update', [{fieldName: 'UpdateId', fieldVal: $(this).data('groupid')}])
    });

    $(".btn-leave-ag").on("click", function(event) {
        appendSubmitForm('leave', [{fieldName: 'LeaveGroup', fieldVal: $(this).data('groupname')}])
    });

    $("#btnSaveNewGroup").on("click", function() {
        $("#createModal").modal("hide");
        $("#inputAction").val("create");
        $("#frmCreate").submit();
    });

    $("#btnSubmitPassword").on("click", function() {
        $("#passwordModal").modal("hide");
        $("#frmPassword #inputAction").val("delete");
        $("#frmPassword").submit();
    });

})


function appendSubmitForm(action, fieldList, context) {
    let postUrl = window.location.href;
    let postForm = '';
    let postFormText = '<form action="' + postUrl + '" method="post">' +
                      '<input type="text" name="inputAction" value="' + action + '" />';
    fieldList.forEach(function(val, idx, list) {
      postFormText += '<input type="text" name="input' + val.fieldName + '"" value="' + val.fieldVal + '" />';
    })
    postFormText += '</form>';
    postForm = $(postFormText);
    $('body').append(postForm);
    postForm.submit();
}
