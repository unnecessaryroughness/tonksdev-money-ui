$(function() {

    //page onload scripts
    $.ajax({
      url: location.origin + '/ajax/cashperday',
      data: {"payday": 27, "balance": $("#totalBalance").text()},
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
