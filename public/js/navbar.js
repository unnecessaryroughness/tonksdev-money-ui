$(function() {

    let tdmag = Cookies.get("tdmag");

    //if the cookie exists, is a string, is not null, and is one of the options in the current account group menu, select it
    if (tdmag && typeof tdmag === "string" && tdmag.length > 0 &&
        ($('.accountgroup-option[id="' + tdmag + '"]').length > 0) ) {

      CURRENT_ACCOUNT_GROUP = tdmag;
    } else {
      //otherwise, select the first item on the menu list
      if (!CURRENT_ACCOUNT_GROUP || typeof CURRENT_ACCOUNT_GROUP === "undefined"
          || CURRENT_ACCOUNT_GROUP.length === 0 || CURRENT_ACCOUNT_GROUP === "ALLUSERS") {

        CURRENT_ACCOUNT_GROUP = $(".accountgroup-option").first().attr("id");
      }
    }

    refreshAGMenu(CURRENT_ACCOUNT_GROUP);

    if(!CURRENT_ACCOUNT_GROUP_ID || typeof CURRENT_ACCOUNT_GROUP_ID === "undefined" || CURRENT_ACCOUNT_GROUP_ID.length === 0) {
      ajaxSwitchAG(CURRENT_ACCOUNT_GROUP);
    }

    $(".accountgroup-option").on("click", function(e) {
        if ($(this).text() !== "none") {
          ajaxSwitchAG($(this).text());
        }
    })
})


function ajaxSwitchAG(groupCode) {
  $.ajax({
    url: location.origin + '/ajax/switchag',
    data: {"accountGroupName": groupCode},
    type: 'POST',
    success: function(data) {
      refreshAGMenu(data.accountGroupName);
      Cookies.set("tdmag", groupCode, {expires: 7});
      location.reload();
    },
    error: function(xhr, status, error) {
      console.log("Error: " + error.message);
    }
  });
}

function refreshAGMenu(selectedGroup) {
  $(".accountgroup-option").each(function(obj, idx) {
    //Add the class "active" to the accountgroup menu option that matches the currently selected accountgroup
    if ($(this).text() === selectedGroup) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  })
}
