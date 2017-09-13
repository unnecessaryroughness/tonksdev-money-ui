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
        if (checkForMandatoryFields($(".mandatory"))) {
          $("#frmCreate #lblMandatoryFields").show();
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
        $("#frmCreate #lblNoMatch").show();
        $("#inputPassword").addClass("form-inline-error-bgcolor");
        $("#confirmPassword").addClass("form-inline-error-bgcolor");
        return false;
      }
    });

    $("#btnEditSaveGroup").on("click", function() {
      if ($("#frmEdit #inputEditNewPassword").val() === $("#frmEdit #confirmEditNewPassword").val()) {
        if (checkForMandatoryFields($("#frmEdit .mandatory"))) {
          $("#frmEdit #lblMandatoryFields").show();
          $(".mandatory").addClass("form-inline-error-bgcolor");
          $(".mandatory:visible:first").focus();
          return false;
        } else {
          $("#editModal").modal("hide");
          $("#frmEdit #inputAction").val("update");
          $("#frmEdit").submit();
        }
      } else {
        $("#frmEdit #lblNoMatch").show();
        $(".mandatory-password").addClass("form-inline-error-bgcolor");
      }

    });

    $("#btnEditLeaveGroup").on("click", function() {
      if (checkForMandatoryFields($("#frmEdit .mandatory-delete"))) {
        $("#frmEdit #lblMandatoryFields").show();
        $(".mandatory-delete").addClass("form-inline-error-bgcolor");
        $(".mandatory-delete:visible:first").focus();
      } else {
        $("#editModal").modal("hide");
        $("#frmEdit #inputAction").val("leave");
        $("#frmEdit").submit();
      }
    });

    $("#btnEditDeleteGroup").on("click", function() {
      if (checkForMandatoryFields($("#frmEdit .mandatory-delete"))) {
        $("#frmEdit #lblMandatoryFields").show();
        $(".mandatory-delete").addClass("form-inline-error-bgcolor");
        $(".mandatory-delete:visible:first").focus();
      } else {
        $("#editModal").modal("hide");
        showConfirmDialog("Delete Account Group -- Confirm?",
                          "Are you sure you want to permanently delete this account group " +
                          "AND all accounts contained in this account group?",
                          function() {
           $("#frmEdit #inputAction").val("delete");
           $("#frmEdit").submit();
         });
     }
    });

    $("#btnSubmitGroupCode").on("click", function() {
      if (checkForMandatoryFields($("#frmGroupCode .mandatory"))) {
        $("#frmGroupCode #lblMandatoryFields").show();
        $(".mandatory").addClass("form-inline-error-bgcolor");
        $(".mandatory:visible:first").focus();
      } else {
        $("#groupCodeModal").modal("hide");
        $("#frmGroupCode #inputJoinGroup").val($("#inputJoinGroup").val().toUpperCase());
        $("#frmGroupCode #inputAction").val("join");
        $("#frmGroupCode").submit();
      }
    });


    $("#createModal").on("hidden.bs.modal", function() {
        $("#inputGroupCode").val("");
        $("#inputDescription").val("");
        $("#inputPassword").val("");
        $("#confirmPassword").val("");
        $(".mandatory").removeClass("form-inline-error-bgcolor");
        $("#frmCreate #lblMandatoryFields").hide();
        $("#frmCreate #lblNoMatch").hide();
    });

    $("#editModal").on("hidden.bs.modal", function() {
        $(".mandatory").removeClass("form-inline-error-bgcolor");
        $("#frmEdit #lblMandatoryFields").hide();
        $("#frmEdit #lblNoMatch").hide();
    });

    $("#groupCodeModal").on("hidden.bs.modal", function() {
        $(".mandatory").removeClass("form-inline-error-bgcolor");
        $("#frmGroupCode #lblMandatoryFields").hide();
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


function checkForMandatoryFields(fldList) {
  let emptyInput = false;
  fldList.each(function(val, idx) {
      if ($(this).val() === "") {
        emptyInput = true;
      }
  });
  return emptyInput;
}
