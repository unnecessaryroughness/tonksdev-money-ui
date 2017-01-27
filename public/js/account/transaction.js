$(function() {

  //initial screen build activity

  if (JSON.stringify(saveObj.payee.transferAccount) !== "{}") {
    //this is a transfer... set up the screen accordingly
    $("#txnType").val("Transfer")

  } else {
    if ($("#txnAmount").val() < 0) {
      $("#txnType").val("Payment");
      $("#txnAmount").val($("#txnAmount").val() - ($("#txnAmount").val()*2))
    } else if ($("#txnAmount").val() >= 0) {
      $("#txnType").val("Deposit");

    }
  }



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


  //wire up close button
  $("#btnCloseTxn").on("click", function(e) {
    window.location.href = "/account/register/" + $(this).parent().data("return-to-account");
  })

  //wire up save button
  $("#btnSaveTxn").on("click", function(e) {


    //IF THE TXN TYPE IS PAYMENT NEGATE THE VALUE INPUT SO IT IS SAVED AS A MINUS VALUE
    saveObj.amount = ( $("#txnType").val() === "Payment" ) ? $("#txnAmount").val() - ($("#txnAmount").val() * 2) : $("#txnAmount").val();
    saveObj.notes = $("#txnNotes").val();
    saveObj.category.id = $("#txnCategory").val();
    saveObj.category.name = $("#txnCategory option:selected").text();
    saveObj.payee.id = $("#txnPayee").val();
    saveObj.payee.name = $("#txnPayee option:selected").text();
    saveObj.transactionDate = $("#txnDate").val();

    // console.log(saveObj);
    // return;

    // window.alert(saveObj.id + " " + $("#txnNotes").val());

    //construct save object
    // let saveObj = {
    //   "transaction": {
    //     "id": $("#txnId").text(),
    //     "account": {
    //       "group": {
    //         "id": "57a8c444eb388272368806b3",
    //         "code": "FAMILY"
    //       },
    //       "id": "579a5a314a4eff2f21d5a109",
    //       "code": "FDMARK"
    //     },
    //     "payee": {
    //       "transferAccount": {},
    //       "name": "Tesco",
    //       "id": "584f0408884e2dde51ce5f74"
    //     },
    //     "category": {
    //       "name": "Food: Groceries",
    //       "id": "582719a9ccf666abafab3394"
    //     },
    //     "amount": 100.99,
    //     "transactionDate": "2016-12-05T00:00:00.000Z",
    //     "createdDate": "2016-12-05T00:00:00.000Z",
    //     "notes": "Second transaction",
    //     "isCleared": false,
    //     "isPlaceholder": false,
    //     "repeating": {
    //       "frequency": {
    //         "code": "",
    //         "increment": 0
    //       },
    //       "endOnDate": null,
    //       "prevDate": null,
    //       "nextDate": null
    //     }
    //   }
    // }

    let returnToAccount = $(this).parent().data("return-to-account");

    //submit ajax request
    $.ajax({
      url: location.origin + '/ajax/updatetxn',
      data: {"transaction": saveObj},
      type: 'PUT',
      success: function(data) {
        if (data.response.transaction &&  data.response.transaction.amount) {
          // console.log(data);
          // window.alert("saved ok - " + data.response.transaction.amount + " " + data.response.transaction.notes)
          window.location.href = "/account/register/" + returnToAccount;
        } else {
          window.alert("save failed :-(");
          // console.log(data);
        }
      },
      error: function(xhr, status, error) {
        console.log("Error: " + error.message);
      }
    });

  })

  //wire up delete button
  $("#btnDeleteTxn").on("click", function(e) {
    window.location.href = "/account/register/" + $(this).parent().data("return-to-account");
  })


});
