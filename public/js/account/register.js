$(function() {

  $("tr[data-txid] > td:first-child").on("click", function(e) {
    callAjaxClearedTxnApi($(this).parent().attr("data-txid"), $(this));
  })



  callAjaxClearedTxnApi = function(txid, elem) {
    $.ajax({
      url: location.origin + '/ajax/cleartxn',
      data: {"transactionId": txid},
      type: 'PUT',
      success: function(data) {
        if (data.isCleared) {
          elem.parent().removeClass("uncleared");
        } else {
          elem.parent().addClass("uncleared")
        }
      },
      error: function(xhr, status, error) {
        console.log("Error: " + error.message);
      }
    });
  }

});
