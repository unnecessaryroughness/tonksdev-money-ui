var calendarHelper = function() {
    'use strict';

    var self = this;

    var getCalData = function(monthreq, seldate) {
        //if no month parameter was specified, fail out
        if (!monthreq || typeof monthreq === 'undefined' ||
            parseInt(monthreq.substr(0,2)) <= 0) {
              return {error: {number: 404, description: 'monthreq parameter was missing or invalid'}};
        }

        var pMonth = monthreq.substr(0,2);
        var pYear  = monthreq.substr(2,6);
        var calMonth = parseInt(pMonth) -1;

        //set up month name array
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                          'August', 'September', 'October', 'November', 'December'];

        //calculate the 'previous month' based on the input parameter
        var py = (parseInt(pMonth) -1) >= 1 ? parseInt(pYear) : parseInt(pYear) -1;
        var pm = (parseInt(pMonth) -1) >= 1 ? parseInt(pMonth) -1 : 12;
        var previousMonth = ('00'+(pm.toString())).slice(-2).concat(py);

        //calculate the 'next month' based on the input parameter
        var ny = (parseInt(pMonth) +1) <= 12 ? parseInt(pYear) : parseInt(pYear) +1;
        var nm = (parseInt(pMonth) +1) <= 12 ? parseInt(pMonth) +1 : 1;
        var nextMonth = ('00'+(nm.toString())).slice(-2).concat(ny);

        //get today's date
        var today = new Date();

        //calculate the day of the week for the 1st day of the requested month
        var firstDOM = new Date(pYear, calMonth, 1);
        var firstDOW = firstDOM.getDay();

        //calculate how many total days there are in the month
        var lastDOM = 0;
        if (['04', '06', '09', '11'].indexOf(pMonth.toString()) !== -1) {
            lastDOM = new Date(pYear, calMonth, 30);
        } else if (['02'].indexOf(pMonth.toString()) !== -1) {
            if (new Date(pYear, 1, 29).getMonth() === 1) {
                lastDOM = new Date(pYear, calMonth, 29);
            } else {
                lastDOM = new Date(pYear, calMonth, 28);
            }
        } else {
            lastDOM = new Date(pYear, calMonth, 31);
        }

        //cells array has 42 [7x7] elements
        var cells = [];
        var date = 1;

        //loop around every cell (c) in the calendar
        for (var c=0; c<=42; c++) {
            if (c < firstDOW || date > lastDOM.getDate()) {
                cells.push('');
            } else {
                cells.push(date.toString());
                date +=1;
            }
        }

        //set selected day number (or default to today's day number if not supplied)
        var selDate = seldate || '';
        var selDateFull = (selDate.length === 0 ? '' : new Date(pYear, pMonth, selDate).toISOString().substr(0,10));

        //set up the return JSO object
        var rtnVal = {
            'today': today.toISOString().substr(0,10),
            'todayDayNumber': ('00'+(today.getDate().toString())).slice(-2),
            'selectedDayNumber': selDate,
            'selectedDate': selDateFull,
            'year': pYear,
            'month': pMonth,
            'showingCurrentMonth': (today.getMonth() === calMonth ? '1' : '0'),
            'displayMonth': monthNames[calMonth],
            'firstDateOfMonth': firstDOM.toISOString().substr(0,10),
            'lastDateOfMonth': lastDOM.toISOString().substr(0,10),
            'firstWeekDayOfMonth': firstDOW.toString(),
            'lastDayOfMonth': lastDOM.getDate().toString(),
            'previousMonthCode': previousMonth,
            'thisMonthCode': monthreq,
            'nextMonthCode': nextMonth,
            'calendarCells': cells
        };

        return rtnVal;
    };


    return {
        getCalData: getCalData
    };
};

module.exports = calendarHelper();
