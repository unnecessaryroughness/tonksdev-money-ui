$(function() {

    $("#btnSaveNewGroup").on("click", function() {
        $("#createModal").modal("hide");
        $("#inputAction").val("create");
        $("#frmCreate").submit();
    })
})
