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
            res.json(preparePhoto(doc, req));
        });
    });

    app.get('/photo', function(req, res){
        photos.find({}, function(err, docs){
            docs.forEach(function(photo){
                photo.url = getPhotoUrl(photo, req);
            })
            res.json(docs);
        });
    });

    app.delete('/photo/:photoId', function(req, res){
        photos.remove({_id: req.params.photoId});
        res.json({photoId: req.params.photoId});
    });

    var preparePhoto = function(photo, req){
        photo.url = getPhotoUrl(photo,req);
        return photo;
    }

    var getPhotoUrl = function(photo, req){
        return req.app.settings.blobAccountName == 'devstoreaccount1'
            ? 'http://' + req.app.settings.blobStorageUrl + '/' + req.app.settings.blobAccountName + '/' + req.app.settings.blobPhotoName  + '/' + photo._id + '.' + photo.fileExt
            : 'http://' + req.app.settings.blobStorageUrl + '/' + req.app.settings.blobPhotoName + '/' + photo._id + '.' + photo.fileExt;
    }

    app.post('/photo/upload', function(req, res){

        var accountName = req.app.settings.blobAccountName;
        var accountKey = req.app.settings.blobAccountKey;
        var host = req.app.settings.blobStorageUrl;
        var blobService = azure.createBlobService(accountName, accountKey, host).withFilter(new azure.ExponentialRetryPolicyFilter());

        blobService.createContainerIfNotExists(req.app.settings.blobPhotoName,
            {publicAccessLevel : 'blob'},
            function(error){
            console.log(error);
        });

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
                    } else {
                        console.log(error);
                    }

                    res.redirect('/');
                });
        });
    });
}

