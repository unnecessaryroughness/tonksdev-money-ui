$(function() {

  //very first thing... check if there is a cached txn in a cookie. If so, restore it and delete the Cookie
  let cachedTxn = Cookies.getJSON("cachedTxn");
  let cachedPayee = Cookies.getJSON("cachedPayee");
  let cachedCategory = Cookies.getJSON("cachedCategory");
  if (cachedTxn && cachedTxn.id) {
    saveObj = cachedTxn;
    refreshFromSaveObj();
    if (cachedPayee) {
      $("#txnPayee option:contains(" + cachedPayee + ")").attr("selected", "selected");
      Cookies.remove("cachedPayee");
    }
    if (cachedCategory) {
      $("#txnCategory option:contains(" + cachedCategory + ")").attr("selected", "selected");
      Cookies.remove("cachedCategory");
    }
    Cookies.remove("cachedTxn");
  } else {
    // console.log("Fail!!! I got this: ", cachedTxn);
  }


  //initial screen build activity
  if (JSON.stringify(saveObj.payee.transferAccount) !== "{}" &&
          typeof saveObj.payee.transferAccount !== "undefined" &&
          saveObj.payee.transferAccount.id) {

    //this is a transfer... set up the screen accordingly
    $("#txnType").val("Transfer")
    $("#txnAmount").val(($("#txnAmount").val() - ($("#txnAmount").val()*2)).toFixed(2))

  } else {
    if ($("#txnAmount").val().length === 0) {
      $("#txnType").val("Payment");
    } else if ($("#txnAmount").val() <= 0) {
      $("#txnType").val("Payment");
      $("#txnAmount").val(($("#txnAmount").val() - ($("#txnAmount").val()*2)).toFixed(2));
    } else if ($("#txnAmount").val() > 0) {
      $("#txnType").val("Deposit");
    }
  }

  assessTxnTypeFields();

  var d = saveObj.repeating.nextDate ? new Date(saveObj.repeating.nextDate) : new Date();
  var ed = saveObj.repeating.endOnDate ? new Date(saveObj.repeating.endOnDate) : new Date();
  $("#txnDate").val(d.getFullYear().toString() + "-" + ("00"+(d.getMonth()+1).toString()).slice(-2) + "-" + ("00"+d.getDate().toString()).slice(-2));
  $("#txnEndOnDate").val(ed.getFullYear().toString() + "-" + ("00"+(ed.getMonth()+1).toString()).slice(-2) + "-" + ("00"+ed.getDate().toString()).slice(-2));


  $("#txnFrequency").val(saveObj.repeating.frequency.code);
  refreshFrequencyLabel();


  //set initial focus
  if ($("#txnType").val() === "Transfer") {
    $("#txnTxfAccount").focus();
  } else {
    $("#txnPayee").focus();
  }


  //auto highlight amount field contents on focus
  $("#txnAmount").on("focus", function(e) {
    $(this).select();
  })

  $("#txnAmount").on("keypress", function(e) {
    if (e.which === 13) {
      $("#btnSaveTxn").click();
      return false;
    }
  })

  //refresh calendar when date field changed
  $("#txnDate").on("change", function(e) {
    var d = new Date($("#txnDate").val());
    refreshCal("txnDateCal", ("00"+((d.getMonth()+1).toString())).slice(-2) + (d.getFullYear()).toString(), d.getDate().toString());
    $("#txnEndOnDate").val(incrementEndDate($(this).val()));
  })

  //refresh label on frequency changed
  $("#txnFrequency").on("change", function(e) {
    refreshFrequencyLabel();
  })

  //replace the date with the lastNewTransactionDate if available and this is a NEW transaction
  if (window.location.href.substr(-2) === "/0") {
    if (sessionData.lastNewTransactionDate && sessionData.lastNewTransactionDate.length > 0) {
      $("#txnDate").val(sessionData.lastNewTransactionDate);
    }
  }


  //generate calendar
  $("#txnDateCal").html(generateCalendarTable("txnDateCal", 42));
  $("#txnDate").change();

  //refresh date field when calendar changed
  $("#txnDateCal_txtDate").on("change", function(e) {
     $("#txnDate").val($(this).val());
     $("#txnEndOnDate").val(incrementEndDate($(this).val()));
  })


  //switch fields around when transaction type changed to Transfer
  $("#txnType").on("change", function(e) {
    assessTxnTypeFields();
  })

  //perform math on the amount field
  $("#txnAmount").on("blur", function(e) {
    $(this).val(eval($(this).val()).toFixed(2));
  })

  //recall most recent transaction for same payee when the payee is changed
  $("#txnPayee").on("change", function(e) {
    updateSaveObj();
    $.ajax({
      url: location.origin + '/ajax/payeerecent',
      data: {"transactionId": saveObj.id, "accountId": saveObj.account.id, "payeeId": saveObj.payee.id, "categoryId": null},
      type: 'GET',
      success: function(data) {
        let foundTxn = JSON.parse(data).transactionList[0];
        // console.log("found: " + foundTxn.amount + " " + foundTxn.category.name);
        // $("#txnAmount").val((foundTxn.amount-(foundTxn.amount * 2)));
        $("#txnAmount").val(foundTxn.amount != 0 ? (foundTxn.amount-(foundTxn.amount * 2)) : $("#txnAmount").val());
        $("#txnCategory option").removeAttr("selected");
        $("#txnCategory option:contains(" + foundTxn.category.name + ")").attr("selected", "selected");
      },
      error: function(xhr, status, error) {
        //do nothing
      }
    });
  })


  //recall most recent transaction for same payee + category when category is changed
  $("#txnCategory").on("change", function(e) {
    updateSaveObj();
    $.ajax({
      url: location.origin + '/ajax/payeerecent',
      data: {"transactionId": saveObj.id, "accountId": saveObj.account.id, "payeeId": saveObj.payee.id, "categoryId": saveObj.category.id},
      type: 'GET',
      success: function(data) {
        let foundTxn = JSON.parse(data).transactionList[0];
        // console.log("found: " + foundTxn.amount + " " + foundTxn.category.name);
        $("#txnAmount").val(foundTxn.amount != 0 ? (foundTxn.amount-(foundTxn.amount * 2)) : $("#txnAmount").val());
      },
      error: function(xhr, status, error) {
        //do nothing
      }
    });
  })




  //wire up callbacks for new Payee & Category button clicks
  $("#btnSaveNewPayee").data("presaveCallback", storeCurrentRecordToCookie)
  $("#btnSaveNewCategory").data("presaveCallback", storeCurrentRecordToCookie)


  //wire up close button
  $("#btnCloseTxn").on("click", function(e) {
    window.location.href = "/repeating";
  })

  //wire up save button
  $("#btnSaveTxn").on("click", function(e) {
    updateSaveObj();
    if (window.location.href.substr(-2) === "/0") {
      appendSubmitForm('create', [{fieldName: "transaction", fieldVal: JSON.stringify(saveObj)}])
    } else {
      appendSubmitForm('update', [{fieldName: "transaction", fieldVal: JSON.stringify(saveObj)}])
    }
  })

  //wire up delete button
  $("#btnDeleteTxn").on("click", function(e) {
    showConfirmDialog("Delete Repeating Transaction -- Confirm?",
                      "Are you sure you want to permanently delete this transaction? " +
                      "This process cannot be reversed!",
                      function() {
                        updateSaveObj();
                        appendSubmitForm('delete', [{fieldName: 'transaction', fieldVal: JSON.stringify(saveObj)}])
                      });
   });

  //wire up apply button
  $("#btnApplyTxn").on("click", function(e) {
    showConfirmDialog("Apply Repeating Transaction -- Confirm?",
                      "Are you sure you want to apply the next iteration of this transaction? " +
                      "This process cannot be reversed!",
                      function() {
                        updateSaveObj();
                        appendSubmitForm('apply', [{fieldName: 'transaction', fieldVal: JSON.stringify(saveObj)}])
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
  saveObj.account.id = $("#txnAccount").val();
  saveObj.account.code = $("#txnAccount option:selected").text();
  saveObj.payee.id = $("#txnPayee").val();
  saveObj.payee.name = $("#txnPayee option:selected").text();
  saveObj.category.id = $("#txnCategory").val();
  saveObj.category.name = $("#txnCategory option:selected").text();
  saveObj.notes = $("#txnNotes").val();
  saveObj.isCleared = $("#txnCleared").is(":checked");
  saveObj.isPlaceholder = $("#txnPlaceholder").is(":checked");
  saveObj.repeating.nextDate = $("#txnDate").val();
  saveObj.repeating.endOnDate = $("#txnEndOnDate").val();
  saveObj.repeating.frequency.code = $("#txnFrequency").val();
  saveObj.repeating.frequency.increment = $("#txnFrequencyMonths").val();


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
  $("#txnDate").val(saveObj.repeating.nextDate);
  $("#txnEndOnDate").val(saveObj.repeating.endOnDate);
  $("#txnFrequency").val(saveObj.repeating.frequency.code);
  $("#txnFrequencyMonths").val(saveObj.repeating.frequency.increment);
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


function refreshFrequencyLabel() {
  switch($("#txnFrequency").val()) {
    case "D":
      $("#lblFrequencyMonths").text("Days")
      break;
    case "W":
      $("#lblFrequencyMonths").text("Weeks")
      break;
    case "M":
      $("#lblFrequencyMonths").text("Months")
      break;
    case "Y":
      $("#lblFrequencyMonths").text("Years")
      break;
    default:
      $("#lblFrequencyMonths").text("????")
      break;
  }
}


function storeCurrentRecordToCookie() {
  updateSaveObj();
  let in30minutes = 1/48;
  Cookies.set("cachedTxn", saveObj, {expires: in30minutes});
  if ($("#inputPayeeName")) {
    Cookies.set("cachedPayee", $("#inputPayeeName").val(), {expires: in30minutes})
  }
  if ($("#inputCategoryName")) {
    Cookies.set("cachedCategory", $("#inputCategoryName").val(), {expires: in30minutes})
  }
}


function incrementEndDate(startdate) {
  let newEndOnDate = new Date(startdate);
  newEndOnDate.setFullYear(newEndOnDate.getFullYear()+5);
  return newEndOnDate.toISOString().substr(0,10);
}
