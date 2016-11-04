$(function() {
    'use strict';

    //when any modal is shown
    $(".modal").on("shown.bs.modal", function() {
        $("input:visible:first").focus();
    });

    //when create modal is closed
    $("#createModal").on("hidden.bs.modal", function() {
        $("#inputAcctCode").val("");
        $("#inputAcctName").val("");
        $("#inputBankName").val("");
        $(".mandatory").removeClass("form-inline-error-bgcolor");
        $("#lblMandatoryFields").hide();
    });

    //when edit button is clicked
    $(".btn-edit-ag").on("click", function(event) {
        $("#inputEditAcctCode").val($(this).data('accountcode'));
        $("#inputEditAcctName").val($(this).data('accountname'));
        $("#inputEditBankName").val($(this).data('bankname'));
        $("#selEditAcctType").val($(this).data('accounttype'));
        $("#inputEditId").val($(this).data('accountid'));
    });

    //when save button clicked on create account modal
    $("#btnSaveNewAcct").on("click", function() {
      $(".mandatory").removeClass("form-inline-error-bgcolor");
      $("#warning-labels label").hide();

      let emptyInput = false;
      $("#frmCreateAcct .mandatory").each(function(val, idx) {
          if ($(this).val() === "") {
            emptyInput = true;
          }
      });
      if (emptyInput) {
        $("#lblMandatoryFields").show();
        $(".mandatory").addClass("form-inline-error-bgcolor");
        $("input:visible:first").focus();
        return false;
      } else {
        $("#inputAcctCode").val($("#inputAcctCode").val().toUpperCase());
        $("#createModal").modal("hide");
        $("#frmCreateAcct").submit();
      }
    });


    //when save button clicked on edit account modal
    $("#btnEditSaveAcct").on("click", function() {
        $("#editModal").modal("hide");
        $("#frmEdit #inputAction").val("update");
        $("#frmEdit").submit();
    });

    //when delete button clicked on edit account modal
    $("#btnEditDeleteAcct").on("click", function() {
        $("#editModal").modal("hide");
        showConfirmDialog("Delete Account -- Confirm?",
                          "Are you sure you want to permanently delete this account? " +
                          "This process cannot be reversed!",
                          function() {
           $("#frmEdit #inputAction").val("delete");
           $("#frmEdit").submit();
         });
    });

})
