
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.details = function(req, res){
	res.send('details for user with id: ' + req.params.userId);
}