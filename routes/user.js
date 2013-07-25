
/*
 * GET users listing.
 */

/*exports.list = function(req, res){
  res.send("respond with a resource " + req.app.settings.mongoDB + ' ' + req.app.settings.port);
};

exports.details = function(req, res){
	res.send('details for user with id: ' + req.params.userId);
} */

var monk = require('monk');

exports.list = function(req, res){
    var users = monk(req.app.settings.mongoDB).get('users');

    users.find({}, function(err, docs){
        if (err) throw err;

        res.json(docs);
    });
}

exports.create = function(req, res){
    var newUser = req.body;

    if(newUser.password != newUser.repeatPassword){
        res.send(500, 'Пароли не совпадают');
        return;
    }

    var users = monk(req.app.settings.mongoDB).get('users');

    users.insert(newUser, function(error, doc){
        if (error) throw error;
        res.send('saved with id ' + doc._id);
    });
}