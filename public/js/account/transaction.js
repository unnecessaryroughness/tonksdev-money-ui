$(function() {

  //very first thing... check if there is a cached txn in a cookie. If so, restore it and delete the Cookie
  let cachedTxn = Cookies.getJSON("cachedTxn");
  let cachedPayee = Cookies.getJSON("cachedPayee");
  if (cachedTxn && cachedTxn.id) {
    saveObj = cachedTxn;
    refreshFromSaveObj();
    $("#txnPayee option:contains(" + cachedPayee + ")").attr("selected", "selected");
    Cookies.remove("cachedTxn");
    Cookies.remove("cachedPayee");
  } else {
    console.log("Fail!!! I got this: ", cachedTxn);
  }


  //initial screen build activity
  if (JSON.stringify(saveObj.payee.transferAccount) !== "{}" && typeof saveObj.payee.transferAccount !== "undefined") {
    //this is a transfer... set up the screen accordingly
    $("#txnType").val("Transfer")
    $("#txnAmount").val(($("#txnAmount").val() - ($("#txnAmount").val()*2)).toFixed(2))

  } else {
    if ($("#txnAmount").val().length === 0) {
      $("#txnType").val("Payment");
    } else if ($("#txnAmount").val() < 0) {
      $("#txnType").val("Payment");
      $("#txnAmount").val($("#txnAmount").val() - ($("#txnAmount").val()*2))
    } else if ($("#txnAmount").val() >= 0) {
      $("#txnType").val("Deposit");
    }
  }

  assessTxnTypeFields();



  //refresh calendar when date field changed
  $("#txnDate").on("change", function(e) {
    var d = new Date($("#txnDate").val());
    refreshCal("txnDateCal", ("00"+((d.getMonth()+1).toString())).slice(-2) + (d.getFullYear()).toString(), d.getDate().toString());
  })

  //generate calendar
  $("#txnDateCal").html(generateCalendarTable("txnDateCal", 42));
  $("#txnDate").change();

  //refresh date field when calendar changed
  $("#txnDateCal_txtDate").on("change", function(e) {
     $("#txnDate").val($(this).val());
  })


  //switch fields around when transaction type changed to Transfer
  $("#txnType").on("change", function(e) {
      assessTxnTypeFields();
  })


  //wire up callback for new Payee button click
  $("#btnSaveNewPayee").data("presaveCallback", storeCurrentRecordToCookie)


  //wire up close button
  $("#btnCloseTxn").on("click", function(e) {
    window.location.href = "/account/" + $(this).parent().data("return-to-account") + "/register";
  })

  //wire up save button
  $("#btnSaveTxn").on("click", function(e) {

    updateSaveObj();
    let returnToAccount = $(this).parent().data("return-to-account");

    //submit ajax request
    $.ajax({
      url: location.origin + '/ajax/updatetxn',
      data: {"transaction": saveObj, "isNew": (window.location.href.substr(-2) === "/0") ? "true" : "false"},
      type: 'PUT',
      success: function(data) {
        if (data.response.transaction &&  data.response.transaction.amount) {
          window.location.href = "/account/" + returnToAccount + "/register";
        } else {
          window.alert("save failed :-(");
        }
      },
      error: function(xhr, status, error) {
        console.log("Error: " + JSON.stringify(error),  xhr.responseText );
      }
    });

  })

  //wire up delete button
  $("#btnDeleteTxn").on("click", function(e) {
    showConfirmDialog("Delete Transaction -- Confirm?",
                      "Are you sure you want to permanently delete this transaction? " +
                      "This process cannot be reversed!",
                      function() {

                        //submit ajax request
                        $.ajax({
                          url: location.origin + '/ajax/deletetxn',
                          data: {"transaction": {id: saveObj.id}},
                          type: 'DELETE',
                          success: function(data) {
                            if (data.response.saveStatus &&  data.response.saveStatus === "deleted") {
                              window.location.href = "/account/" + $("#button-group").data("return-to-account") + "/register";
                            } else {
                              window.alert("delete failed :-( " + JSON.stringify(data));
                            }
                          },
                          error: function(xhr, status, error) {
                            console.log("Error: " + JSON.stringify(error),  xhr.responseText );
                          }
                        });
                      });
     });

});


function assessTxnTypeFields() {
    switch($("#txnType").val()) {
      case "Transfer":
        $("#txnPayee").val("");
        $("#input-group-txnPayee").addClass("input-group-hidden");
        $("#input-group-txnTxfAccount").removeClass("input-group-hidden");
        break;
      case "Payment":
        $("#txnTxfAccount").val("");
        $("#lblPayee").text("Pay To");
        $("#input-group-txnTxfAccount").addClass("input-group-hidden");
        $("#input-group-txnPayee").removeClass("input-group-hidden");
        break;
      case "Deposit":
        $("#txnTxfAccount").val("");
        $("#lblPayee").text("Received From");
        $("#input-group-txnTxfAccount").addClass("input-group-hidden");
        $("#input-group-txnPayee").removeClass("input-group-hidden");
        break;
    }
  }


function updateSaveObj() {
  //IF THE TXN TYPE IS PAYMENT NEGATE THE VALUE INPUT SO IT IS SAVED AS A MINUS VALUE
  saveObj.amount = ( $("#txnType").val() !== "Deposit" ) ? $("#txnAmount").val() - ($("#txnAmount").val() * 2) : $("#txnAmount").val();

  //IF THE CURRENT ACCOUNT ID <> PREVIOUS ACCOUNT ID THEN SET THE VALUE OF THE PREVIOUS ACCONT ID/code
  if ($("#txnAccount").val() !== saveObj.account.id) {
    saveObj.account.previous.id = saveObj.account.id;
    saveObj.account.previous.code = saveObj.account.code;
  }
  saveObj.transactionDate = $("#txnDate").val();
  saveObj.account.id = $("#txnAccount").val();
  saveObj.account.code = $("#txnAccount option:selected").text();
  saveObj.payee.id = $("#txnPayee").val();
  saveObj.payee.name = $("#txnPayee option:selected").text();
  saveObj.category.id = $("#txnCategory").val();
  saveObj.category.name = $("#txnCategory option:selected").text();
  saveObj.notes = $("#txnNotes").val();
  saveObj.isCleared = $("#txnCleared").is(":checked");
  saveObj.isPlaceholder = $("#txnPlaceholder").is(":checked");

  if (!$("#txnTxfAccount").val()) {
    delete saveObj.payee.transferAccount;
  } else {
    delete saveObj.payee.id;
    delete saveObj.payee.name;
    saveObj.payee.transferAccount.id = $("#txnTxfAccount").val();
    saveObj.payee.transferAccount.code = $("#txnTxfAccount option:selected").text();
  }
}


function refreshFromSaveObj() {
  $("#txnAmount").val(saveObj.amount);
  $("#txnDate").val(saveObj.transactionDate);
  $("#txnAccount").val(saveObj.account.id);
  $("#txnAccount option:selected").text(saveObj.account.code);
  $("#txnPayee").val(saveObj.payee.id);
  // $("#txnPayee option:selected").text(saveObj.payee.name);
  $("#txnCategory").val(saveObj.category.id);
  // $("#txnCategory option:selected").text(saveObj.category.name);
  $("#txnNotes").val(saveObj.notes);
  $("#txnCleared").is(":checked", saveObj.isCleared);
  $("#txnPlaceholder").is(":checked", saveObj.isPlaceholder);
  if (saveObj.payee.transferAccount) {
    $("#txnTxfAccount").val(saveObj.payee.transferAccount.id);
    $("#txnTxfAccount option:selected").text(saveObj.payee.transferAccount.code);
  }
}



function storeCurrentRecordToCookie() {
  updateSaveObj();
  let in30minutes = 1/48;
  Cookies.set("cachedTxn", saveObj, {expires: in30minutes});
  Cookies.set("cachedPayee", $("#inputPayeeName").val(), {expires: in30minutes})
}
