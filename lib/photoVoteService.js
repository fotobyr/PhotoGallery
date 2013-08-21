/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 21.08.13
 * Time: 16:39
 * To change this template use File | Settings | File Templates.
 */

/*var photoVoteService = function(){
    this.getKey = function(date){
        return date.getFullYear() + "-" + date.getMonth();
    }

    this.getCurrentKey = function(){
        return this.getKey(new Date());
    }
}

module.exports = photoVoteService;*/

module.exports.getKey = function(date){
    return date.getFullYear() + "-" + date.getMonth();
}

module.exports.getCurrentKey = function(){
    return this.getKey(new Date());
}

module.exports.getRating = function(photo, key){
    if (noRatingProperty(photo))
        return 0;

    if (!isRatingHasKey(photo, key))
        return 0;

    return photo.rating[key];
}

module.exports.getCurrentRating = function(photo){
    return this.getRating(photo, this.getCurrentKey());
}

module.exports.setRating = function(photo, key, vote){
    if (noRatingProperty(photo))
        photo.rating = {};

    if (!isRatingHasKey(photo, key)){
        photo.rating[key] = {
            totalVote: 0,
            votes: 0
        };
    }

    photo.rating[key].totalVote += vote;
    photo.rating[key].votes++;

    return photo.rating[key];
}

module.exports.setCurrentRating = function(photo, vote){
    return this.setRating(photo, this.getCurrentKey(), vote);
}

function noRatingProperty(photo){
    return typeof photo.rating === 'undefined';
}

function isRatingHasKey(photo, key){
    return typeof photo.rating[key] !== 'undefined';
}