$(function() {

    refreshAGMenu(CURRENT_ACCOUNT_GROUP);

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
