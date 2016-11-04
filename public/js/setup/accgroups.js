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
      $(".mandatory").removeClass("form-inline-error-bgcolor");
      $("#warning-labels label").hide();

      if ($("#inputPassword").val() === $("#confirmPassword").val()) {
        let emptyInput = false;
        $(".mandatory").each(function(val, idx) {
            if ($(this).val() === "") {
              emptyInput = true;
            }
        });
        if (emptyInput) {
          $("#lblMandatoryFields").show();
          $("input").addClass("form-inline-error-bgcolor");
          $("input:visible:first").focus();
          return false;
        } else {
          $("#inputGroupCode").val($("#inputGroupCode").val().toUpperCase());
          $("#createModal").modal("hide");
          $("#inputAction").val("create");
          $("#frmCreate").submit();
        }
      } else {
        $("#lblNoMatch").show();
        $("#inputPassword").addClass("form-inline-error-bgcolor");
        $("#confirmPassword").addClass("form-inline-error-bgcolor");
        return false;
      }
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
        showConfirmDialog("Delete Account Group -- Confirm?",
                          "Are you sure you want to permanently delete this account group " +
                          "AND all accounts contained in this account group?",
                          function() {
           $("#frmEdit #inputAction").val("delete");
           $("#frmEdit").submit();
         });
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


    $("#createModal").on("hidden.bs.modal", function() {
        $("#inputGroupCode").val("");
        $("#inputDescription").val("");
        $("#inputPassword").val("");
        $("#confirmPassword").val("");
        $(".mandatory").removeClass("form-inline-error-bgcolor");
        $("#lblMandatoryFields").hide();
    });

    $(".modal").on("shown.bs.modal", function() {
        $("input:visible:first").focus();
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
