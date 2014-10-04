NodeLogger
=========
  
[![Build Status](https://travis-ci.org/Korilakkuma/NodeLogger.svg?branch=master)](https://travis-ci.org/Korilakkuma/NodeLogger)
  
Log Library for Node.js
  
## Overview
  
This library enables the followings in Node.js Application.
  
* Show log message on console
* Record log
* Send emergency mail
  
## Installation
  
    $ npm install nodelogger
  
## Usage
  
It is required that [Nodemailer](https://github.com/andris9/Nodemailer) is installed.
  
    $ npm install
  
and,
  
    $ echo "export NODE_PATH='/usr/local/lib/node_modules/'" >> ~/.bashrc
  
### Constructor
  
    var NodeLogger = require('./NodeLogger.js');

    // Log file path
    var log = 'error.log';

    // for sending mail
    var settings = {
        service : 'Gmail',
        auth    : {
            user : 'sample@gmail.com',
            pass : 'xxxxxx',
            port : 25
        }
    };

    // Create the instance of NodeLogger
    var nodeLogger = new NodeLogger(log, settings);
  
In the case of not sending mail,
  
    var NodeLogger = require('./NodeLogger.js');

    // Log file path
    var log = 'error.log';

    // Create the instance of NodeLogger
    var nodeLogger = new NodeLogger(log);
  
## API
  
### Show log message on console
  
In the case of showing log message on console.
  
    var message = 'showLog';  // Log message
    var lineNo  = 22;         // Line number
    var method  = 'error';    // This method is console object

    nodeLogger.showLog(message, lineNo, method);
  
### Record log
  
In the case of recording log message in log file.
  
    var message = 'showLog';  // Log message
    var lineNo  = 23;         // Line number

    nodeLogger.appendLog(message, lineNo);
  
### Send emergency mail
  
In the case of sending emergency mail.  
Please refer to [Nodemailer](https://github.com/andris9/Nodemailer) for details.
  
    var options = {
        to      : 'sample@gmail.com',
        subject : 'NodeLogger TEST',
        html    : 'sendMail',
        from    : 'node-ninja'
    };

    // This callback is executed when sending mail is successful.
    var successCallback = function(result) {
        console.dir(result);
    };

    // This callback is executed when sending mail failed.
    var errorCallback = function(result, error) {
        console.dir(result);
        console.dir(error);
    };

    nodeLogger.sendMail(options, successCallback, errorCallback);
  
## License
  
Copyright (c) 2014 Tomohiro IKEDA (Korilakkuma)  
Released under the MIT license
  
