$(function() {

  //when new category modal is shown
  $("#createCategoryModal").on("shown.bs.modal", function() {
    $("input:visible:first").focus();
  });

  //when create modal is closed
  $("#createCategoryModal").on("hidden.bs.modal", function() {
    $("#inputCategoryName").val("");
    $(".mandatory").removeClass("form-inline-error-bgcolor");
    $("#lblMandatoryFields").hide();
  });

  //when save button clicked on create account modal
  $("#createCategoryModal #btnSaveNewCategory").on("click", function() {
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
      $("#createCategoryModal").modal("hide");
      if($(this).data("presaveCallback")) {
        $(this).data("presaveCallback")();
      }
      $("#frmCreateCategory").submit();
    }
  });

  //force the save button click event to fire when you press enter in the textbox
  $("#inputCategoryName").on("keypress", function(e) {
    let key = e.which;
    if (key === 13) {
      $("#createCategoryModal #btnSaveNewCategory").click();
      return false;
    }
  })

})
