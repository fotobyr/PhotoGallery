/**
 * Created with JetBrains WebStorm.
 * User: gengzu
 * Date: 26.07.13
 * Time: 20:42
 * To change this template use File | Settings | File Templates.
 */

var userService = function(){

}

module.exports.create = function(){
    return new userService();
}

userService.prototype.validate = function(user){
    if (user.password == '')
        return false;

    if (user.password != user.repeatPassword)
        return false;

    return true;
}