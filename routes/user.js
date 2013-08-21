
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

    if (!newUser.password || newUser.password == ''){
        res.send(500, 'Пароль не может быть пустым');
        return;
    }

    if(newUser.password != newUser.repeatPassword){
        res.send(500, 'Пароли не совпадают');
        return;
    }

    var users = monk(req.app.settings.mongoDB).get('users');

    users.insert({
        login: newUser.login,
        email: newUser.email,
        password: newUser.password,
        created: new Date()
    }, function(error, doc){
        if (error) throw error;
        res.send('saved with id ' + doc._id);
    });
}

exports.login = function(req, res){
    var users = monk(req.app.settings.mongoDB).get('users');

    users.findOne({password: req.body.password, email: req.body.email})
        .on('success', function(doc){
            if (doc != null) {
                req.session.authorized = true;
                req.session.username = doc.login;
                req.session.userEmail = doc.email;
                req.session.userId = doc._id;
                req.session.userCreated = doc.created;
            }

            res.json({user: doc});
        })
        .on('error', function(err){
            res.send(500, 'fail');
        });
}

exports.logout = function(req, res){
    req.session = null;
    res.json({user: null});
}

exports.delete = function(req, res){
    var users = monk(req.app.settings.mongoDB).get('users');

    users.remove({_id: req.params.userId}, function(){
        res.json({userId: req.params.userId});
    });
}