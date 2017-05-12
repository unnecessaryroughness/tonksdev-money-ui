function appendSubmitForm(action, fieldList, context) {
    let postUrl = window.location.href;
    let postForm = '';
    let postFormText = '<form action="' + postUrl + '" method="post">' +
                      '<input type="text" name="inputAction" value="' + action + '" />';
    fieldList.forEach(function(val, idx, list) {
      postFormText += '<input type=\'text\' name=\'input' + val.fieldName + '\' value=\'' + val.fieldVal + '\' />';
    })
    postFormText += '</form>';
    postForm = $(postFormText);
    $('body').append(postForm);
    postForm.submit();
}
