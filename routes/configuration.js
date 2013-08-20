/**
 * Created with JetBrains WebStorm.
 * User: gengzu
 * Date: 23.07.13
 * Time: 15:17
 * To change this template use File | Settings | File Templates.
 */

exports.get = function(req, res){
    res.json({
        isAdmin: req.session.userEmail == 'gengzu@gmail.com',
        isGuest: typeof req.session.userId !== 'undefined' || !req.session.userId,
        userName: req.session.username,
        userId: req.session.userId
    });
}