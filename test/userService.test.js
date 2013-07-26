var assert = require('assert'),
	should = require('should'),
    userService = require('../lib/userService').create();

describe("UserService", function(){
    it('password should not be empty', function(){
        userService.validate({
            password: '',
            repeatPassword: ''
        }).should.false;
    })

    it('repeatPassword should be same as password', function(){
        userService.validate({
            password: '111',
            repeatPassword: '222'
        }).should.false;
    })

    it('should return true if all is ok', function(){
        userService.validate({
            password: '666',
            repeatPassword: '666'
        }).should.true;
    })
})