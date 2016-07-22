'use strict';

var sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    callAPI = require('../common/callAPI');


chai.should();

describe('testing CallAPI generic function', function() {

    it('should get a clean 200 response from www.google.co.uk', function(done) {
        callAPI('www.google.co.uk', 'GET', null, null, function(error, response, body) {
            // console.log(error, response.statusCode, body.substr(0, 1000));
            expect(response.statusCode).to.equal(200);
            expect(body).to.exist;
            done();
        })
    });


//************************************************************************
//below tests only work LOCALLY as they depend on a running API container
//************************************************************************


    // it('should get a clean 200 response from 0.0.0.0:8081/ayt', function(done) {
    //     callAPI('0.0.0.0:8081/ayt', 'GET', null, null, function(error, response, body) {
    //         // console.log(error, response.statusCode, body.substr(0, 1000));
    //         expect(response.statusCode).to.equal(200);
    //         expect(body).to.exist;
    //         done();
    //     })
    // });
    //
    // it('should get a clean 200 response from 0.0.0.0:8081/user/<num> PUT (update)', function(done) {
    //     let updateJson = {
    //                         "user": {
    //                           "id": "578a56fac7e3640165aeb282",
    //                           "displayName": "Cole Beasley",
    //                           "email": "bease@dallascowboys.com",
    //                           "image": "",
    //                           "payday": "23",
    //                           "biography": "",
    //                           "joinDate": "2016-03-01",
    //                           "groups": [
    //                             "ALLUSERS",
    //                             "COWBOYS"
    //                           ]
    //                         }
    //                       }
    //     callAPI('0.0.0.0:8081/user/578a56fac7e3640165aeb282', 'PUT', updateJson, null, function(error, response, body) {
    //         console.log(error, response.statusCode, body);
    //         expect(response.statusCode).to.equal(200);
    //         expect(body).to.exist;
    //         done();
    //     })
    // });


});
