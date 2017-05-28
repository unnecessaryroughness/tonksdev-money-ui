function appendSubmitForm(action, fieldList, context) {
    let postUrl = window.location.href;
    let postForm = '';
    let postFormText = '<form action="' + postUrl + '" method="post">' +
                      '<input type="hidden" name="inputAction" value="' + action + '" />';

    fieldList.forEach(function(val, idx, list) {
      postFormText += '<input type=\'hidden\' name=\'input' + val.fieldName + '\' id=\'input' + val.fieldName + '\' />';
    })
    postFormText += '</form>';
    postForm = $(postFormText);
    $('body').append(postForm);

    fieldList.forEach(function(val, idx, list) {
      $("#input" + val.fieldName).val(val.fieldVal);
    })

    postForm.submit();
}
