$(function() {
    'use strict';

    //when any modal is shown
    $(".modal").on("shown.bs.modal", function() {
        $("input:visible:first").focus();
    });

    //when create modal is closed
    $("#createModal").on("hidden.bs.modal", function() {
        $("#inputCategoryName").val("");
        $(".mandatory").removeClass("form-inline-error-bgcolor");
        $("#lblMandatoryFields").hide();
    });

    //when edit button is clicked
    $(".btn-edit-ag").on("click", function(event) {
        $("#inputEditCategoryName").val($(this).data('categoryname'));
        $("#inputCategoryId").val($(this).data('categoryid'));
    });

    //when save button clicked on create account modal
    $("#btnSaveNewCategory").on("click", function() {
      $(".mandatory").removeClass("form-inline-error-bgcolor");
      $("#warning-labels label").hide();

      let emptyInput = false;
      $("#frmCreateCategory .mandatory").each(function(val, idx) {
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
        $("#frmCreateCategory").submit();
      }
    });


    //when save button clicked on edit account modal
    $("#btnEditSaveCategory").on("click", function() {
        $("#editModal").modal("hide");
        $("#frmEdit #inputAction").val("update");
        $("#frmEdit").submit();
    });

    //when delete button clicked on edit account modal
    $("#btnEditDeleteCategory").on("click", function() {
        $("#editModal").modal("hide");
        showConfirmDialog("Delete Category -- Confirm?",
                          "Are you sure you want to permanently delete this category? " +
                          "This process cannot be reversed!",
                          function() {
           $("#frmEdit #inputAction").val("delete");
           $("#frmEdit").submit();
         });
    });

})
