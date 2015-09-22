describe('NodeLogger TEST', function() {

    describe('NodeLogger.prototype.constructor', function() {

        var NodeLogger = require('../src/NodeLogger.js');
        var assert     = require('assert');

        it('should return log file path', function() {
            var log = 'test/error.log';

            var nodeLogger = new NodeLogger(log);

            assert(nodeLogger.getLog() === log);
        });

        it('should return log file path and mail settings', function() {
            var log      = 'test/error.log';
            var settings = {
                // host    : '',
                service : 'Gmail',
                auth    : {
                    user : 'xxxxxx@gmail.com',
                    pass : 'xxxxxx',
                    port : 25
                }
            };

            var nodeLogger = new NodeLogger(log, settings);

            assert(nodeLogger.getLog() === log);

            assert(nodeLogger.getMailSettings().service   === settings.service);
            assert(nodeLogger.getMailSettings().auth.user === settings.auth.user);
            assert(nodeLogger.getMailSettings().auth.pass === settings.auth.pass);
            assert(nodeLogger.getMailSettings().auth.port === settings.auth.port);

            assert(nodeLogger.getMailer() === require('nodemailer'));
        });

    });

});
