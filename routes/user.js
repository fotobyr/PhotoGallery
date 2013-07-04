
/*
 * GET users listing.
 */

exports.appPort = null;

exports.list = function(req, res){
  res.send("respond with a resource " + req.app.settings.mongoDB + ' ' + req.app.settings.port);
};

exports.details = function(req, res){
	res.send('details for user with id: ' + req.params.userId);
}