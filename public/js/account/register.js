$(function() {

  $("tr[data-txid] > td:first-child").on("click", function(e) {
    callAjaxClearedTxnApi($(this).parent().attr("data-txid"), $(this));
  })

  $("#btnAddNewTxn").on("click", function(e) {
    window.location.href="/account/" + $(this).data("accid") + "/transaction/0"
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


  $("#accountShortcut").on("change", function(e){
    window.location.href="/account/" + $(this).val() + "/register/" + $("#accountTxnLimit").val();
  })

  $("#accountTxnLimit").on("change", function(e){
    window.location.href="/account/" + $("#accountShortcut").val() + "/register/" + $(this).val();
  })

  window.scrollBy(0,-100);

  if (!isNaN(window.location.href.substr(-3))) {
    $('#accountTxnLimit option[value="' + window.location.href.substr(-3) + '"]').attr("selected", "selected");
  }

});
