/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 01.07.13
 * Time: 12:00
 * To change this template use File | Settings | File Templates.
 */

//var db = require('monk')('mongodb://gengzu:leeloo123@ds027758.mongolab.com:27758/PhotoGallery-Mongo'),
var db = require('monk')('localhost/gallery'),
    photos = db.get('photos');

exports.list = function(req, res){
    photos.find({}, function(err, docs){
        res.json(docs);
    });
}

exports.get = function(req, res){
    photos.findById(req.params.photoId, function(err, doc){
        res.json(doc);
    })
}

function populatePhotos(){
    photos.insert({name: 'photo 22', desc: 'desc 2'});
    photos.insert({name: 'photo 333', desc: 'desc 3'});
    photos.insert({name: 'photo 666', desc: 'desc 6'});
    photos.insert({name: 'photo 1', desc: 'desc 1'});
}