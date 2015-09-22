/**
 * NodeLogger.js
 * @fileoverview Log Library for Node.js
 *
 * Copyright (c) 2014 Tomohiro IKEDA (Korilakkuma)
 * Released under the MIT license
 */
 
 
 
/**
 * The instance of this class defines methods for log.
 * @param {string} log This argument is log file path.
 * @param {object} settings This argument is associative array that has information for mail server or mail service.
 * @constructor
 */
function NodeLogger(log, settings) {
    process.stdout.setEncoding('UTF-8');
    process.stderr.setEncoding('UTF-8');

    this.fs = require('fs');

    this.log       = String(log);
    this.settings  = {
        auth : {}
    };
    this.mailer    = null;

    if (Object.prototype.toString.call(settings) === '[object Object]') {
        for (var key in settings) {
            switch (key.toLowerCase()) {
                case 'host' :
                    // SMTP

                    if ('service' in this.settings) {
                        delete this.settings.service;
                    }

                    this.settings.host = settings.host;

                    break;
                case 'service' :
                    // Web Mail Service (Gmail, Hotmail ...etc)

                    if ('host' in this.settings) {
                        delete this.settings.host;
                    }

                    this.settings.service = settings.service;

                    break;
                case 'auth' :
                    if (Object.prototype.toString.call(settings.auth) === '[object Object]') {
                        if ('user' in settings.auth) {this.settings.auth.user = String(settings.auth.user);}
                        if ('pass' in settings.auth) {this.settings.auth.pass = String(settings.auth.pass);}
                        if ('port' in settings.auth) {this.settings.auth.port = (parseInt(settings.auth.port) >= 0) ? parseInt(settings.auth.port) : NodeLogger.DEFAULT_PORT;}
                    }

                    break;
                default :
                    break;
            }
        }

        this.mailer = require('nodemailer');
    }
}

// Constant values
NodeLogger.DEFAULT_PORT    = 25;
NodeLogger.DEFAULT_SUBJECT = 'Information from NodeLogger';
NodeLogger.DEFAULT_BODY    = 'No Body';

/**
 * This method gets log file path.
 * @return {string} This is returned as log file path.
 */
NodeLogger.prototype.getLog = function() {
    return this.log;
};

/**
 * This method gets associative array that has information for mail server or mail service.
 * @return {object} This is returned as associative array that has information for mail server or mail service.
 */
NodeLogger.prototype.getMailSettings = function() {
    return this.settings;
};

/**
 * This method gets "nodemailer" module.
 * @return {object} This is returned as "nodemailer" module.
 */
NodeLogger.prototype.getMailer = function() {
    return this.mailer;
};

/**
 * This method displays message on console.
 * @param {string} message This argument is displayed on console.
 * @param {string} line This argument is line number of program.
 * @param {string} type This argument is method in console object.
 * @return {NodeLogger} This is returned for method chain.
 */
NodeLogger.prototype.showLog = function(message, line, type) {
    var l = parseInt(line);
    var t = String(type).toLowerCase();

    if (l > 0) {
        message = 'LINE ' + l + ' : ' + message;
    }

    if (t in console) {
        console[t](message);
    } else {
        console.log(message);
    }

    console.log('[TRACE]');
    console.trace();

    return this;
};

/**
 * This method writes to log file that is designated by constructor.
 * @param {string} message This argument is written to log file.
 * @param {string} line This argument is line number of program.
 * @return {NodeLogger} This is returned for method chain.
 */
NodeLogger.prototype.appendLog = function(message, line) {
    var formatDateTime = function(number) {
        return ('0' + number).slice(-2);
    };

    var date = new Date();
    var y    = date.getFullYear();
    var m    = formatDateTime(date.getMonth() + 1);
    var d    = formatDateTime(date.getDate());
    var h    = formatDateTime(date.getHours());
    var i    = formatDateTime(date.getMinutes());
    var s    = formatDateTime(date.getSeconds());
    var time = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;

    var l = parseInt(line);

    var log = '';

    if (l > 0) {
        log = time + '\tLINE ' + l + '\t' + String(message) + '\n';
    } else {
        log = time + '\tLINE Unknown\t' + String(message) + '\n';
    }

    this.fs.appendFile(this.log, log, function(error) {
        if (error) {
            process.stderr.write('NodeLogger appendLog() : ' + error.message + '\n');
        }
    });

    return this;
};

/**
 * This method sends mail.
 * @param {object} options This argument is mail contents.
 *     Please refer to 'https://github.com/andris9/Nodemailer' for details.
 * @param {function} successCallback This argument is executed when sending mail is successful.
 * @param {function} errorCallback This argument is executed when sending mail failed.
 * @return {NodeLogger} This is returned for method chain.
 */
NodeLogger.prototype.sendMail = function(options, successCallback, errorCallback) {
    if (this.mailer === null) {
        // do nothing
        return;
    }

    if (!(('host' in this.settings) || ('service' in this.settings))) {
        // do nothing
        return;
    }

    if (!(('auth' in this.settings) && ('user' in this.settings.auth) && ('pass' in this.settings.auth))) {
        // do nothing
        return;
    }

    if (Object.prototype.toString.call(options) !== '[object Object]') {
        // do nothing
        return;
    }

    if (!(('to' in options) && /^([*+!.&#$|\'\\%\/0-9a-z^_`{}=?~:-]+)@(([0-9a-z-]+\.)+[0-9a-z]{2,})$/i.test(options.to))) {
        // do nothing
        return;
    }

    if (!options.subject) {
        options.subject = NodeLogger.DEFAULT_SUBJECT;
    }

    if (!(options.text || options.html)) {
        options.html = NodeLogger.DEFAULT_BODY;
    }

    var smtp = this.mailer.createTransport(this.settings);

    if (Object.prototype.toString.call(successCallback) !== '[object Function]') {successCallback = function() {};}
    if (Object.prototype.toString.call(errorCallback)   !== '[object Function]') {errorCallback   = function() {};}

    smtp.sendMail(options, function(error, result) {
        if (error) {
            errorCallback(result, error);
        } else {
            successCallback(result);
        }

        smtp.close();
    });
};

// Public
module.exports = NodeLogger;
