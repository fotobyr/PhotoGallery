/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 04.07.13
 * Time: 15:45
 * To change this template use File | Settings | File Templates.
 */

function SetImageTitle(){
    var titleInput = $('#fileName');

    if (titleInput.val().length == 0)
    {
        var fileInputValueArray = $('#imageFile').val().replace('\\', '/').split('\\');
        titleInput.val(fileInputValueArray.length > 1 ? fileInputValueArray[fileInputValueArray.length - 1] : fileInputValueArray[0]);
    }
}
