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

    app.get('/populate_photo', function(req, res){
            photos.insert({name: 'photo 1', desc: 'desc 2'});
            photos.insert({name: 'photo 2', desc: 'desc 3'});
            photos.insert({name: 'photo 3', desc: 'desc 6'});
            photos.insert({name: 'photo 666', desc: 'desc 1'});

        res.send('done');
    });

    app.post('/photo/upload', function(req, res){
        console.log(req.files);

        var accountName = 'gengzu2gallery';
        var accountKey = '1VZNALenihkQ+CcaOyks7wb2zGm+ckk/fAOnwk7Xtx92kFhenZi0JkMUEpT5LnTTezdZgw3jpB/yqhaH/ZMv/Q==';
        var host = accountName + '.blob.core.windows.net';
        var blobService = azure.createBlobService(accountName, accountKey, host).withFilter(new azure.ExponentialRetryPolicyFilter());

        blobService.createBlockBlobFromFile('photos'
            , req.files.imageFile.name
            , req.files.imageFile.path
            , function(error){
                if(!error){
                    console.log('uploaded');
                }
            });

        res.send(req.files);
    });
}

