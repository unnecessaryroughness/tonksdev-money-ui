function generateCalendarTable(calname, maxcells) {

    var rtnVal = ' \
        <div id="' + calname + '" class="dtpCalendar"> \
            <table id="tblCal" class="tblCalendar"> \
                <tr> \
                    <th class="tCell thCalHeader" id="' + calname + '_thMonthPrev">&lt;</th> \
                    <th class="tCell thCalHeader thCalMonthName" colspan="5" id="' + calname + '_thMonthName">Month</th> \
                    <th class="tCell thCalHeader" id="' + calname + '_thMonthNext">&gt;</th> \
                </tr> \
                <tr>  \
                    <th class="tCell thCalHeader">S</th> \
                    <th class="tCell thCalHeader">M</th> \
                    <th class="tCell thCalHeader">T</th> \
                    <th class="tCell thCalHeader">W</th> \
                    <th class="tCell thCalHeader">T</th> \
                    <th class="tCell thCalHeader">F</th> \
                    <th class="tCell thCalHeader">S</th> \
                </tr> ' +
                    generateCalendarRows(calname, maxcells) +
            '</table> \
            <div id="hiddenFields"> \
                <input type="hidden" id="' + calname + '_txtDate"><br> \
            </div> \
        </div> \
    ';
    return rtnVal;
}


function generateCalendarRows(calname, maxcells) {

    var rtnVal = "<tr>";
    var cols = 0;
    calname = calname || "defaultcal";

    //loop number of cells adding boxes
    for (var i=0; i<maxcells; i++) {

        //if at max number of cells then stop. If at column 7 then start a new column.
        if (i === maxcells) {
            rtnVal = rtnVal.concat('</tr>');
            break;
        } else if (cols === 7) {
            rtnVal = rtnVal.concat('</tr><tr>');
            cols = 0;
        }

        //calculate padded cell number
        var cellnumber = ("00"+(i.toString())).slice(-2);

        //define html for cell
        rtnVal = rtnVal.concat('<td class="tCell tdCalDay" id="', calname, '_c', cellnumber, '"></td>');

        //increment column counter
        cols++;
    }

    return rtnVal;
}


function refreshCal(calname, monthyear, defdate) {
    $.ajax({
      url: location.origin + '/ajax/caldata',
      data: {"monthReq": monthyear, "defaultDate": defdate},
      type: 'GET',
      success: function(data) {
        //console.log("SUCCESS: " + data.thisMonthCode);
        // console.log(data);

        //remove formatting
        $("#" + calname + " .tdCalDay").removeClass("caltoday");
        $("#" + calname + " .tdCalDay").removeClass("calselected");

        //populate days
        $(".tdCalDay").each(function(i,o){
            var useCell = $(this).attr("id").substr(-2);
            $("#" + calname + "_c" + useCell).text(data.calendarCells[parseInt(useCell)]);
        });

        //populate heading
        $("#" + calname + "_thMonthName").text(data.displayMonth + " " + data.year);

        //populate previous & next month buttons
        $("#" + calname + " .thCalHeader").unbind("click");

        $("#" + calname + "_thMonthPrev").click(function() {
            refreshCal(calname, data.previousMonthCode);
        });

        $("#" + calname + "_thMonthNext").click(function() {
            refreshCal(calname, data.nextMonthCode);
        });

        $("#" + calname + "_thMonthName").click(function() {
            var d = new Date();
            refreshCal(calname, ("00"+((d.getMonth()+1).toString())).slice(-2) + (d.getFullYear()).toString());
        });

        //highlight today
        $("#" + calname + " .tdCalDay").each(function(i,o) {
            if (parseInt(data.showingCurrentMonth) === 1 &&
                parseInt($(this).text()) === parseInt(data.todayDayNumber)) {
                $(this).addClass("caltoday");
            }
            if (parseInt($(this).text()) === parseInt(data.selectedDayNumber)) {
                $(this).addClass("calselected");
            }
        });

        //set the hidden date field
        $("#" + calname + "_txtDate").val(data.selectedDate);

        //set the onClick event of each non-header cell
        $("#" + calname + " .tdCalDay").on("click", function() {
            if ($(this).text().length > 0) {
                $("#" + calname + " .tdCalDay").removeClass("calselected");
                $("#" + calname + "_txtDate").val(new Date(data.year, data.month-1, parseInt($(this).text())+1).toISOString().substr(0,10));
                $(this).addClass("calselected");
                $("#" + calname + "_txtDate").change();
            }
        });
      },
      error: function(xhr, status, error) {
        console.log("Error: " + error.message);
      }
    });
}
