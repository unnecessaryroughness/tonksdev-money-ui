'use strict';

var sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    ctrl = require('../controllers/aytController'),
    app = require('../common/moneyUI'),
    supertest = require('supertest');

//need to stub out the REQUEST call so the CI will work

chai.should();

describe('"Are You There??" functional testing', function() {

    var tstCtrl, tstApp;

    beforeEach(function() {
        tstCtrl = new ctrl({
          'apiaddress': '0.0.0.0:8081',
          'apiip': '0.0.0.0',
          'apiport': '8081',
          'mongourl': '172.17.0.3:27017/session?authSource=admin',
          'environment': 'MOCHA-TESTING',
          'ipaddress': '0.0.0.0',
          'port': '8080'
        });
    });


    it('should load the controller cleanly and create a usable application object', function() {
        expect(tstCtrl).to.not.be.undefined;
        expect(tstCtrl.aytData).to.exist;
        expect(tstCtrl.aytAPI).to.exist;
    });

    // it('should return valid JSON data from the aytData function', function(done) {
    //     tstCtrl.aytData(function(err, data) {
    //         //console.log(data);
    //         expect(err).to.be.null;
    //         expect(data).to.not.be.null;
    //         expect(data.application).to.equal('UI');
    //         expect(data.apiayt.application).to.equal('API');
    //         done();
    //     })
    // })
    //
    // it('should return valid JSON data from the aytAPI function', function(done) {
    //     tstCtrl.aytAPI(function(err, data) {
    //         //console.log(data);
    //         expect(err).to.be.null;
    //         expect(data).to.not.be.null;
    //         expect(data.application).to.equal('API');
    //         done();
    //     })
    // })


    // it('should return valid json data by running the base app and calling the url /ayt', function(done) {
    //     process.env.IP = '0.0.0.0';
    //     process.env.PORT = '8080';
    //     process.env.MONEYSESSION_PORT_27017_TCP_ADDR = '172.17.0.3';
    //     process.env.MONEYSESSION_PORT_27017_TCP_PORT = '27017';
    //     process.env.NODE_ENV = 'MOCHA-TESTING';
    //     process.env.SESSION_SECRET = 'xyz';
    //     process.env.MONEYAPI_PORT_8081_TCP_ADDR = '0.0.0.0';
    //     process.env.MONEYAPI_PORT_8081_TCP_PORT = '8081';
    //
    //     tstApp = new app();
    //     tstApp.initialize();
    //     tstApp.start();
    //     var server = supertest.agent('http://' + process.env.IP + ':' + process.env.PORT);
    //
    //     server
    //       .get('/ayt')
    //       .expect('Content-Type', /json/)
    //       .expect(200)
    //       .end(function(err, res) {
    //           // console.log(res.body);
    //           res.status.should.equal(200);
    //           res.body.application.should.equal("UI");
    //           res.body.apiayt.application.should.equal("API");
    //           tstApp.stop();
    //           done();
    //       })
    // })
    //
    // it('should return valid json data by running the base app and calling the url /aytAPI', function(done) {
    //     process.env.IP = '0.0.0.0';
    //     process.env.PORT = '8080';
    //     process.env.MONEYSESSION_PORT_27017_TCP_ADDR = '172.17.0.3';
    //     process.env.MONEYSESSION_PORT_27017_TCP_PORT = '27017';
    //     process.env.NODE_ENV = 'MOCHA-TESTING';
    //     process.env.SESSION_SECRET = 'xyz';
    //     process.env.MONEYAPI_PORT_8081_TCP_ADDR = '0.0.0.0';
    //     process.env.MONEYAPI_PORT_8081_TCP_PORT = '8081';
    //
    //     tstApp = new app();
    //     tstApp.initialize();
    //     tstApp.start();
    //     var server = supertest.agent('http://' + process.env.IP + ':' + process.env.PORT);
    //
    //     server
    //       .get('/aytAPI')
    //       .expect('Content-Type', /json/)
    //       .expect(200)
    //       .end(function(err, res) {
    //           // console.log(res.body);
    //           res.status.should.equal(200);
    //           res.body.application.should.equal("API");
    //           tstApp.stop();
    //           done();
    //       })
    // })


});
