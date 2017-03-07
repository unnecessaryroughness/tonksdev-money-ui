$(function() {
    'use strict';

    //when any modal is shown
    $(".modal").on("shown.bs.modal", function() {
        $("input:visible:first").focus();
    });

    //when create modal is closed
    $("#createModal").on("hidden.bs.modal", function() {
        $("#inputPayeeName").val("");
        $(".mandatory").removeClass("form-inline-error-bgcolor");
        $("#lblMandatoryFields").hide();
    });

    //when edit button is clicked
    $(".btn-edit-ag").on("click", function(event) {
        $("#inputEditPayeeName").val($(this).data('payeename'));
        $("#inputPayeeId").val($(this).data('payeeid'));
    });

    //when save button clicked on create account modal
    $("#btnSaveNewPayee").on("click", function() {
      $(".mandatory").removeClass("form-inline-error-bgcolor");
      $("#warning-labels label").hide();

      let emptyInput = false;
      $("#frmCreatePayee .mandatory").each(function(val, idx) {
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
        $("#createModal").modal("hide");
        $("#frmCreatePayee").submit();
      }
    });


    //when save button clicked on edit account modal
    $("#btnEditSavePayee").on("click", function() {
        $("#editModal").modal("hide");
        $("#frmEdit #inputAction").val("update");
        $("#frmEdit").submit();
    });

    //when delete button clicked on edit account modal
    $("#btnEditDeletePayee").on("click", function() {
        $("#editModal").modal("hide");
        showConfirmDialog("Delete Payee -- Confirm?",
                          "Are you sure you want to permanently delete this payee? " +
                          "This process cannot be reversed!",
                          function() {
           $("#frmEdit #inputAction").val("delete");
           $("#frmEdit").submit();
         });
    });

})
