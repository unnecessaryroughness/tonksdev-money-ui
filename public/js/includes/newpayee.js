$(function() {

  //when new payee modal is shown
  $("#createPayeeModal").on("shown.bs.modal", function() {
    $("input:visible:first").focus();
  });

  //when create modal is closed
  $("#createPayeeModal").on("hidden.bs.modal", function() {
    $("#inputPayeeName").val("");
    $(".mandatory").removeClass("form-inline-error-bgcolor");
    $("#lblMandatoryFields").hide();
  });

  //when save button clicked on create account modal
  $("#createPayeeModal #btnSaveNewPayee").on("click", function() {
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
      $("#createPayeeModal").modal("hide");
      if($(this).data("presaveCallback")) {
        $(this).data("presaveCallback")();
      }
      $("#frmCreatePayee").submit();
    }
  });

})
