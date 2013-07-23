/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 01.07.13
 * Time: 12:00
 * To change this template use File | Settings | File Templates.
 */

module.exports = function(app){

    var azure = require('azure');
    var db = require('monk')(app.get('mongoDB'));
    var photos = db.get('photos');

    app.get('/photo/:photoId', function(req, res){
        photos.findById(req.params.photoId, function(err, doc){
            res.json(doc);
        });
    });

    app.get('/photo', function(req, res){
        photos.find({}, function(err, docs){
            res.json(docs);
        });
    });

    app.post('/photo/upload', function(req, res){

        var accountName = req.app.settings.blobAccountName;
        var accountKey = req.app.settings.blobAccountKey;
        var host = accountName + '.blob.core.windows.net';
        var blobService = azure.createBlobService(accountName, accountKey, host).withFilter(new azure.ExponentialRetryPolicyFilter());

        var fileName = req.files.imageFile.name;
        var fileExt = fileName.split('.')[fileName.split('.').length - 1];

        var promise = photos.insert({
            title: req.param('fileName', req.files.imageFile.name),
            fileOriginalName: req.files.imageFile.name,
            fileExt: fileExt,
            added: new Date()
        });

        promise.success(function(doc){
            blobService.createBlockBlobFromFile(req.app.settings.blobPhotoName
                , doc._id + '.' + fileExt
                , req.files.imageFile.path
                , function(error){
                    if(!error){
                        console.log('uploaded');
                    }
                });
        });

        console.log('response sent');
        res.send(req.files);
    });
}

