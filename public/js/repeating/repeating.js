$(function() {

  $("#btnAddNewTxn").on("click", function(e) {
    window.location.href="/repeating/0";
  })

  //wire up apply button
  $("#btnApplyAll").on("click", function(e) {
    applyPaydate();
  });

  $("#btnApplyAll2").on("click", function(e) {
    applyPaydate(1);
  });

  $("#btnApplyAll3").on("click", function(e) {
    if ($("#rptApplyDate").attr("valid") === "Y") {
      applySpecificDate($("#rptApplyDate").val());
    }
  });

  $("#rptApplyDate").on("blur", function(e) {
    let re = new RegExp($(this).attr("pattern"));
    if(($(this).val()).length > 0 && !re.test($(this).val())) {
      $(this).addClass("field-validation-bad");
      $(this).attr("valid", "N")
    } else {
      $(this).removeClass("field-validation-bad");
      $(this).attr("valid", "Y")
    }
  })

});


function applyPaydate(addMonths) {
  let paydateObj = calculatePayDate(addMonths);
  executeApply(paydateObj);
}

function applySpecificDate(ISODate) {
  executeApply({
    paydate: ISODate,
    paydateString: ISODate,
    paydateISO: ISODate
  })
}

function executeApply(paydateObj) {
  showConfirmDialog("Apply All Repeating Transactions to (" + paydateObj.paydateString + ") -- Confirm?",
                    "Are you sure you want to apply the next series of repeating transactions? " +
                    "This process cannot be reversed!",
                    function() {
                      appendSubmitForm('applyAll', [{fieldName: 'ToDate', fieldVal: paydateObj.paydateISO}])
                    });
}


function calculatePayDate(addMonths) {

  const getLastWorkingDay = function (paydate) {
     //count backwards from weekend days
     while (paydate.getDay() === 0 || paydate.getDay() === 6) {
         paydate.setDate(paydate.getDate()-1);
     }
     return paydate;
  };

  //get today's date
  var today = new Date(),
      paydate = new Date();

  if (addMonths) {
    paydate.setMonth(paydate.getMonth() + addMonths)
  }

  //set the day of the month to payday
  paydate.setDate($("#hidPayDay").val());

  //if it is already past payday in this month, add another month
  if (today.getDate() >= $("#hidPayDay").val()) {
      paydate.setMonth(paydate.getMonth()+1);
  }

  //if payday is saturday or sunday (dow 0 or 6) then subtract days until dow is 5 (friday)
  paydate = getLastWorkingDay(paydate);

  //if, after adjusting for working days, the paydate is now in the past,
  //restore the original payday, add another month, then adjust for working days again
  if (+paydate <= +today) {
      paydate.setDate($("#hidPayDay").val());
      paydate.setMonth(paydate.getMonth()+1);
      paydate = getLastWorkingDay(paydate);
  }

  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let paydateString = days[paydate.getDay()] + " " + ("00"+paydate.getDate().toString()).slice(-2) + "/" + ("00"+(paydate.getMonth()+1).toString()).slice(-2) + "/" + paydate.getFullYear().toString();
  let paydateISO = paydate.getFullYear().toString() + "-" + ("00"+(paydate.getMonth()+1).toString()).slice(-2) + "-" + ("00"+paydate.getDate().toString()).slice(-2);

  return {
    paydate: paydate,
    paydateString: paydateString,
    paydateISO: paydateISO
  };
}
