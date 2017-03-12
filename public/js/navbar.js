$(function() {

    let tdmag = Cookies.get("tdmag");
    if (tdmag && typeof tdmag === "string" && tdmag.length > 0) {
      CURRENT_ACCOUNT_GROUP = tdmag;
    } else {
      if (!CURRENT_ACCOUNT_GROUP || typeof CURRENT_ACCOUNT_GROUP === "undefined" || CURRENT_ACCOUNT_GROUP.length === 0) {
        CURRENT_ACCOUNT_GROUP = $(".accountgroup-option").first().attr("id");
      }
    }
      
    refreshAGMenu(CURRENT_ACCOUNT_GROUP);

    $(".accountgroup-option").on("click", function(e) {
        if ($(this).text() !== "none") {
          ajaxSwitchAG($(this).text());
        }
    })

    if(!CURRENT_ACCOUNT_GROUP_ID || typeof CURRENT_ACCOUNT_GROUP_ID === "undefined" || CURRENT_ACCOUNT_GROUP_ID.length === 0) {
      ajaxSwitchAG(CURRENT_ACCOUNT_GROUP);
    }
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
