/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 21.08.13
 * Time: 16:40
 * To change this template use File | Settings | File Templates.
 */

var assert = require('assert'),
    should = require('should'),
    voteService = require('../lib/photoVoteService');

describe("VoteServiceTests", function(){
    it("should return correct key by date", function(){
        var dt = new Date(2013, 08, 21);

        var key = voteService.getKey(dt);

        key.should.equal('2013-8');
    });

    it('should return correct current key', function(){
        var dt = new Date();
        var key = dt.getFullYear() + '-' + dt.getMonth();

        voteService.getCurrentKey().should.equal(key);
    });

    it('should return zero rating if it undefined yet', function(){
        var photo = {};
        var key = '2013-08';

        voteService.getRating(photo, key).should.equal(0);
    });

    it('should return correct rating object if it exists', function(){
        var rating = {
            totalVote: 10,
            votes: 3
        };

        var key = '2013-08';

        var photo = {
            rating: {}
        };

        photo.rating[key] = rating;

        voteService.getRating(photo, key).should.equal(rating);
    });

    it('should return zero if no rating for this key', function(){
        var photo = {
            rating: {}
        };

        photo.rating['2013-08'] = {
            totalVote: 10,
            votes: 3
        };

        voteService.getRating(photo, '2013-07').should.equal(0);
    });

    it ('should return correct current rating', function(){
        var key1 = '2013-06',
            currentKey = voteService.getCurrentKey();

        var rating1 = {
            totalVote: 66,
            votes: 5
        };

        var currentRating = {
            totalVote: 100,
            votes: 10
        };

        var photo = {
            rating: {}
        };

        photo.rating[key1] = rating1;
        photo.rating[currentKey] = currentRating;

        voteService.getCurrentRating(photo).should.equal(currentRating);
    });

    it('should add new rating if property is absent', function(){
        var photo = {};
        var key = '2013-04';

        voteService.setRating(photo, key, 4);

        var rating = voteService.getRating(photo,key);
        rating.should.have.property('totalVote', 4);
        rating.should.have.property('votes', 1);
    });

    it ('should correct calculate new rating', function(){
        var key = '2013-05';

        var photo = {
            rating: {}
        };

        photo.rating[key] = {
            totalVote: 5,
            votes: 2
        };

        var rating = voteService.setRating(photo, key, 5);

        rating.should.have.property('totalVote', 10);
        rating.should.have.property('votes', 3);
    });

    it('should set correct current rating', function(){
        var photo = {
            rating: {}
        };

        photo.rating[voteService.getCurrentKey()] = {
            totalVote: 10,
            votes: 3
        };

        var rating = voteService.setCurrentRating(photo, 1);

        rating.should.have.property('totalVote', 11);
        rating.should.have.property('votes', 4);
    });

    it('should return correct total rating', function(){
        var photo = {
            rating: {
                '2013-05' :{
                    totalVote: 5,
                    votes: 2
                },
                '2013-06' :{
                    totalVote: 10,
                    votes: 5
                }
            }
        };

        var totalRating = voteService.getTotalRating(photo);

        totalRating.should.equal(15);
    });
});