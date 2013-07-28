
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('mongoDB', process.env.mongoDB || 'localhost/gallery');

// azure blob configuration
app.set('blobAccountName', process.env.blobAccountName || 'devstoreaccount1');
app.set('blobAccountKey', process.env.blobAccountKey || 'Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==');
app.set('blobStorageUrl', process.env.blobAccountName ? process.env.blobAccountName + '.blob.core.windows.net' : '127.0.0.1:10000' ); // accountName + '.blob.core.windows.net'
app.set('blobPhotoName', process.env.blobPhotoName || 'photos');
app.set('blobThumbnailsName', process.env.blobThumbnailsName || 'thumbnails');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'simple secret phrase'}));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var configuration = require('./routes/configuration');
app.get('/configuration', configuration.get);

var user = require('./routes/user');
app.get('/user', user.list);
app.post('/user', user.create);
app.del('/user/:userId', user.delete);
app.post('/user/login', user.login);

require('./routes/photo')(app);

app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

