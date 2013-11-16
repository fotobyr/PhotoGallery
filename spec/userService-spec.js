/**
 * Created by Oleg on 16.11.13.
 */

userService = require('../lib/userService').create();

describe("User service", function(){
    it('password should not be empty', function(){
        expect(userService.validate({
            password: '',
            repeatPassword: ''
        })).toBe(false);
    })

    it('repeatPassword should be same as password', function(){
        expect(userService.validate({
            password: '111',
            repeatPassword: '222'
        })).toBe(false);
    })

    it('should return true if all is ok', function(){
        expect(userService.validate({
            password: '666',
            repeatPassword: '666'
        })).toBe(true);
    })
})
