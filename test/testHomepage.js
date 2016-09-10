'use strict';

var sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    assert = chai.assert,
    app = require('../common/moneyUI'),
    mockery = require('mockery'),
    request = require('request'),
    supertest = require('supertest'),
    callAPI = require('../common/callAPI');

chai.should();

describe('"Are You There??" functional testing', function() {

    let envVars, ctrl, tstCtrl, tstApp, reqstub, callAPIStub;

    beforeEach(function() {

        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        })

        reqstub = sinon.stub();
        reqstub.yields(null, {statusCode: 200}, '{"accountsList": [ {"accountCode": "TSTACC", "accountName": "test account", "balance": 100.00} ]}');
        mockery.registerMock('request', reqstub);

        ctrl = require('../controllers/homepageController');

        envVars = {
          'apiaddress': '0.0.0.0:8081',
          'apiip': '0.0.0.0',
          'apiport': '8081',
          'mongourl': '172.17.0.3:27017/session?authSource=admin',
          'environment': 'MOCHA-TESTING',
          'ipaddress': '0.0.0.0',
          'port': '8080',
          'uiversion': 0.5
        };
        tstCtrl = new ctrl(envVars);
    });

    it('should get the homepage data fully & completely', function(done) {
        tstCtrl.getHomePageData(envVars, {pgviews: 2}, {userid: 'MOCHA-TEST-USER'}, {}, {}, function(err, data) {
          // console.log(err, data);
          expect(tstCtrl).to.not.be.undefined;
          expect(data.pageTitle).to.equal('tonksDEV Money: Welcome');
          expect(data.pageData.pageViews).to.equal(3);
          expect(data.header.environment).to.equal('MOCHA-TESTING');
          expect(data.header.loggedIn).to.equal(true);
          expect(data.header.loggedInUser.userid).to.equal('MOCHA-TEST-USER');
          done();
        });
    });

    it('should get the balances data fully & completely', function(done) {
        tstCtrl.getBalancesData(envVars, {pgviews: 2, passport: {user: 'MOCHA-TEST-USER'}}, {userid: 'MOCHA-TEST-USER'}, {}, {}, function(err, data) {
          // console.log(err, data);
          expect(tstCtrl).to.not.be.undefined;
          expect(data.pageTitle).to.equal('tonksDEV Money: Balances');
          expect(data.header.environment).to.equal('MOCHA-TESTING');
          expect(data.header.loggedIn).to.equal(true);
          expect(data.header.loggedInUser.userid).to.equal('MOCHA-TEST-USER');
          expect(data.pageData.accountsList.length).to.equal(1);
          expect(data.pageData.accountsList[0].accountCode).to.equal('TSTACC');
          done();
        });
    });

});
