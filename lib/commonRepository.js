/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 22.08.13
 * Time: 10:21
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');

function commonRepository(connectionString){
    mongoose.connect(connectionString);

    var Schema = mongoose.Schema;

    var schemas = {};
    schemas['photos'] = new Schema({
        title: String,
        fileOriginalName: String,
        fileExt: String,
        created: Date,
        createdBy: {
            id: Schema.ObjectId,
            name: String,
            created: Date
        }
    })

    var getModel = function (modelName) {
        return mongoose.model(modelName, schemas[modelName]);
    }

    this.getAll = function(modelName, callback){
        getModel(modelName).find(callback);
    }

    this.mapReduce = function(mapReduceFunc, callback, sort){
        var model = getModel('photos');

        model.mapReduce(mapReduceFunc, function(err, results){
            results.find().sort(sort || {}).exec(function(err, docs){
                callback(err, docs);
            });
        });
    }
}

module.exports = commonRepository;

commonRepository.prototype.PhotosByTotalRating = {
    out: 'results',
    verbose: true,
    map: function(){
        if (!this.rating) return;

        var totalRating = 0;

        for (var r in this.rating){
            totalRating += this.rating[r].totalVote;
        }

        emit(this, totalRating);
    },
    reduce: function(key, values){
        return values;
    }
}