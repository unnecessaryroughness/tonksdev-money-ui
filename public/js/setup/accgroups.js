$(function() {
    'use strict';

    $(".btn-delete-ag").on("click", function(event) {
        $("#frmPassword #inputId").val($(this).data('groupid'));
    });

    $(".btn-edit-ag").on("click", function(event) {
        $("#inputEditId").val($(this).data('groupid'));
        $("#inputEditGroupCode").val($(this).data('groupname'));
        $("#inputEditDescription").val($(this).data('groupdesc'));
    });

    $(".btn-leave-ag").on("click", function(event) {
        appendSubmitForm('leave', [{fieldName: 'LeaveGroup', fieldVal: $(this).data('groupname')}])
    });

    $("#btnSaveNewGroup").on("click", function() {
        $("#createModal").modal("hide");
        $("#inputAction").val("create");
        $("#frmCreate").submit();
    });

    $("#btnEditSaveGroup").on("click", function() {
        $("#editModal").modal("hide");
        $("#frmEdit #inputAction").val("update");
        $("#frmEdit").submit();
    });

    $("#btnEditLeaveGroup").on("click", function() {
        $("#editModal").modal("hide");
        $("#frmEdit #inputAction").val("leave");
        $("#frmEdit").submit();
    });

    $("#btnEditDeleteGroup").on("click", function() {
        $("#editModal").modal("hide");
        $("#frmEdit #inputAction").val("delete");
        $("#frmEdit").submit();
    });

    $("#btnSubmitPassword").on("click", function() {
        $("#passwordModal").modal("hide");
        $("#frmPassword #inputAction").val("delete");
        $("#frmPassword").submit();
    });

    $("#btnSubmitGroupCode").on("click", function() {
        $("#groupCodeModal").modal("hide");
        $("#frmGroupCode #inputAction").val("join");
        $("#frmGroupCode").submit();
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
