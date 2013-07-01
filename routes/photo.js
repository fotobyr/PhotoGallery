/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 01.07.13
 * Time: 12:00
 * To change this template use File | Settings | File Templates.
 */

exports.list = function(req, res){

    var photos = [
        {id: 1, name: 'photo 1', desc: 'desc 1'},
        {id: 22, name: 'photo 22', desc: 'desc 2'},
        {id: 333, name: 'photo 333', desc: 'desc 3'},
        {id: 666, name: 'photo 666', desc: 'desc 6'}
    ];

    res.json(photos)
}