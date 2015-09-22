var NodeLogger = require('../src/NodeLogger.js');

var settings = {
    // host    : '',
    service : 'Gmail',
    auth    : {
        user : '******',
        pass : '******',
        port : 25
    }
};

var options = {
    to      : '******@gmail.com',
    subject : 'NodeLogger TEST',
    html    : new Error('sendMail').toString(),
    from    : 'node-ninja'
};

var nodeLogger = new NodeLogger('examples/error.log', settings);

nodeLogger.showLog(new Error('showLog'), 22, 'error');
nodeLogger.appendLog(new Error('appendLog'), 23);
nodeLogger.sendMail(options, function(result) {
    console.dir(result);
}, function(result, error) {
    console.dir(result);
    console.dir(error);
});
