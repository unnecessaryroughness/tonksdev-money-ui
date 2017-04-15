$(function() {

    //page onload scripts

    //generate calendar
    $("#txnDateCal").html(generateCalendarTable("txnDateCal", 42));
    var d = new Date();
    refreshCal("txnDateCal", ("00"+((d.getMonth()+1).toString())).slice(-2) + (d.getFullYear()).toString(), d.getDate().toString());


    //get cash per day
    $.ajax({
      url: location.origin + '/ajax/cashperday',
      data: {"payday": myPayday, "balance": $("#totalCABalance").text()},
      type: 'GET',
      success: function(data) {
        $("#today").text(data.today);
        $("#nextPayDay").text(data.nextPayDate);
        $("#daysToPayDay").text(data.numberOfDaysToPayday);
        $("#totalBal").text(data.balanceOfAccount);
        $("#cashPerDay").text(data.cashPerDayRemaining);
        $("#cashPerWeek").text(data.cashPerWeekRemaining);

      },
      error: function(xhr, status, error) {
        console.log("Error: " + error.message);
      }
    });

});
