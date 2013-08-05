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
    var im = require('imagemagick');
    var path = require('path');
    var os = require('os');
    var fs = require('fs');

    app.get('/photos/:photoId', function(req, res){
        photos.findById(req.params.photoId, function(err, doc){
            res.json(preparePhoto(doc, req));
        });
    });

    app.get('/photos', function(req, res){
        photos.find({}, function(err, docs){
            if (docs == null){
                res.json([]);
                return;
            }

            docs.forEach(function(photo){
                photo.url = getPhotoUrl(photo, req, req.app.settings.blobPhotoName);
                photo.preview = getPhotoUrl(photo, req, req.app.settings.blobThumbnailsName);
            })
            res.json(docs);
        });
    });

    app.delete('/photos/:photoId', function(req, res){
        photos.remove({_id: req.params.photoId});
        res.json({photoId: req.params.photoId});
    });

    var preparePhoto = function(photo, req){
        photo.url = getPhotoUrl(photo,req, req.app.settings.blobPhotoName);
        photo.preview = getPhotoUrl(photo,req, req.app.settings.blobThumbnailsName);
        return photo;
    }

    var getPhotoUrl = function(photo, req, blobName){
        return req.app.settings.blobAccountName == 'devstoreaccount1'
            ? 'http://' + req.app.settings.blobStorageUrl + '/' + req.app.settings.blobAccountName + '/' + blobName  + '/' + photo._id + '.' + normalizeExt(photo.fileExt)
            : 'http://' + req.app.settings.blobStorageUrl + '/' + blobName + '/' + photo._id + '.' + normalizeExt(photo.fileExt);
    }

    var normalizeExt = function(ext){
        return ext.replace('.', '');
    }

    app.post('/photos/upload', function(req, res){

        var accountName = req.app.settings.blobAccountName;
        var accountKey = req.app.settings.blobAccountKey;
        var host = req.app.settings.blobStorageUrl;
        var blobService = azure.createBlobService(accountName, accountKey, host).withFilter(new azure.ExponentialRetryPolicyFilter());

        var fileName = req.files.imageFile.name;
        var fileExt = path.extname(fileName);

        var promise = photos.insert({
            title: req.param('fileName', req.files.imageFile.name),
            fileOriginalName: req.files.imageFile.name,
            fileExt: fileExt,
            added: new Date()
        });

        promise.success(function(doc){
            var smallImage = path.normalize(os.tmpDir()) + path.sep + doc._id + '-small' + fileExt;

            var imBinaryPath = path.join(__dirname, '..', 'bin', 'ImageMagick-6.8.6-7') + path.sep;

            im.convert.path = imBinaryPath + 'convert.exe';
            im.identify.path = imBinaryPath + 'identify.exe';

            im.crop({
                srcPath: req.files.imageFile.path,
                dstPath: smallImage,
                width: 177,
                height: 180,
                srcFormat: 'jpg',
                format: 'jpg',
                strip: true
            }, function(err, stdout, stderr){
                if (err)
                {   console.log(err);
                    throw err;
                }

                var azureFileName = doc._id + fileExt;

                uploadToAzure(blobService, req.app.settings.blobPhotoName, azureFileName, req.files.imageFile.path, function(){
                    uploadToAzure(blobService, req.app.settings.blobThumbnailsName, azureFileName, smallImage, function(){
                        console.log('uploaded');
                        res.redirect('/');
                    })
                });
            });
        });
    });

    var uploadToAzure = function(blobService, blobName, fileName, filePath, callback){

        blobService.createContainerIfNotExists(blobName,
            {publicAccessLevel : 'blob'},
            function(error){
                if (error) throw error;

                blobService.createBlockBlobFromFile(blobName
                    , fileName
                    , filePath
                    , function(error){
                        if(!error){
                            callback();
                        } else {
                            throw error;
                        }
                    });
            });
    }
}

