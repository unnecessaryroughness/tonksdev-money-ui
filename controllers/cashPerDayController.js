const debug = require('debug')('tonksDEV:money:api:cashPerDayController'),
      callAPI = require('../common/callAPI');

const controller = function(moneyUIVars) {
  'use strict';

  const getLastWorkingDay = function (paydate) {
     while (paydate.getDay() === 0 || paydate.getDay() === 6) {
         paydate.setDate(paydate.getDate()-1);
     }
     return paydate;
  };

  const getValidPaydate = function (checkdate, checkmonth = null) {
    console.log("getting valid pay date using date: " + checkdate + " and month " + checkmonth)
    if (checkdate == 31) {
      let lastDateOfMonth = new Date()
      let targetmonth = checkmonth || lastDateOfMonth.getMonth() + 1
      lastDateOfMonth.setMonth(targetmonth)
      lastDateOfMonth.setDate(0)
      return lastDateOfMonth
    } else {
      let targetDate = new Date()
      targetDate.setDate(checkdate)
      return targetDate
    }
  }

  const cashPerDay = function(pPayday, pBalance, pToday, done) {

      //get today's date
      var today = new Date(),
      paydate = new Date();

     //if payday parameter is missing or invalid, fail out
       if ((!pPayday || parseInt(pPayday) <= 0)) {
           //build the return value
           var rtnVal = {
               'today': today.toISOString().substr(0,10),
               'payDayOfMonth': '<invalid>',
               'nextPayDate': '<invalid>',
               'numberOfDaysToPayday': '<invalid>',
               'balanceOfAccount': '<invalid>',
               'cashPerDayRemaining': '<invalid>',
               'cashPerWeekRemaining': '<invalid>'
           };
           return done({error: 'payday parameter was missing or invalid'}, rtnVal);
       }

     //set the day of the month to payday
     // paydate.setDate(pPayday);
     console.log("Payday in user config:", pPayday)
     paydate = getValidPaydate(pPayday);
     console.log("Calculated paydate as:", paydate.toISOString().split("T")[0])

     //if a "today" date was passed in, replace the content of today variable with that value
     if (pToday) {
         today.setDate(pToday)
     }

     //if it is already past payday in this month, so calculate up to next payday
     if (today.getDate() >= pPayday) {
         paydate.setMonth(paydate.getMonth()+1);
     }

     //if payday is saturday or sunday (dow 0 or 6) then subtract days until dow is 5 (friday)
     paydate = getLastWorkingDay(paydate);

     //if, after adjusting for working days, the paydate is now in the past,
     //restore the original payday, add another month, then adjust for working days again
     if (+paydate <= +today) {
         console.log("paydate for current month is in the past... recalculating")
         // paydate.setDate(pPayday);
         // paydate.setMonth(paydate.getMonth()+1);
         paydate = getValidPaydate(pPayday, today.getMonth()+2)
         console.log("Calculated paydate as:", paydate.toISOString().split("T")[0])
         paydate = getLastWorkingDay(paydate);
         console.log("Calculated last working day before paydate as:", paydate.toISOString().split("T")[0])
     }

     //now we have the right date for payday, how many days is it between today and payday?
     var difference = Math.round((paydate-today)/(1000*60*60*24));

     //if balance parameter is missing or invalid, fail out
     if ((!pBalance || parseFloat(pBalance) <= 0)){
         //build the return value
         var rtnVal = {
             'today': today.toISOString().substr(0,10),
             'payDayOfMonth': pPayday,
             'nextPayDate': paydate.toISOString().substr(0,10),
             'numberOfDaysToPayday': difference.toString(),
             'balanceOfAccount': (pBalance || 0.00),
             'cashPerDayRemaining': 0.00,
             'cashPerWeekRemaining': 0.00
         };
         return done({error: 'balance parameter was missing or invalid'}, rtnVal);
     }


     //how much cash do we have each day & week?
     var cashPerDay = (pBalance / difference).toFixed(2),
         cashPerWeek = difference <= 7 ? pBalance : (pBalance / (difference/7)).toFixed(2);

     //build the return value
     var rtnVal = {
         'today': today.toISOString().substr(0,10),
         'payDayOfMonth': pPayday,
         'nextPayDate': paydate.toISOString().substr(0,10),
         'numberOfDaysToPayday': difference.toString(),
         'balanceOfAccount': pBalance,
         'cashPerDayRemaining': cashPerDay,
         'cashPerWeekRemaining': cashPerWeek
     };

     done(null, rtnVal);
  };

  return {
    cashPerDay: cashPerDay
  };

}

module.exports = controller();
