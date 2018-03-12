(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;

/* Package-scope variables */
var Mandrill;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/wylio_mandrill/packages/wylio_mandrill.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/wylio:mandrill/mandrill.js                                                                          //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
Mandrill = {                                                                                                    // 1
                                                                                                                // 2
    options: {},                                                                                                // 3
                                                                                                                // 4
    config: function (options) {                                                                                // 5
        // Taken verbatim from https://mandrillapp.com/api/docs/. We could save a camelCase conversion and camelCase all calls inline below.
        var categories = {                                                                                      // 7
            users: ['info', 'ping', 'ping2', 'senders'],                                                        // 8
            messages: ['send', 'send-template', 'search', 'search-time-series', 'info', 'content', 'parse', 'send-raw', 'list-scheduled', 'cancel-scheduled', 'reschedule'],
            tags: ['list', 'delete', 'info', 'time-series', 'all-time-series'],                                 // 10
            rejects: ['add', 'list', 'delete'],                                                                 // 11
            whitelists: ['add', 'list', 'delete'],                                                              // 12
            senders: ['list', 'domains', 'add-domain', 'check-domain', 'verify-domain', 'info', 'time-series'], // 13
            urls: ['list', 'search', 'time-series', 'tracking-domains', 'add-tracking-domain', 'check-tracking-domain'],
            templates: ['add', 'info', 'update', 'publish', 'delete', 'list', 'time-series', 'render'],         // 15
            webhooks: ['list', 'add', 'info', 'update', 'delete'],                                              // 16
            subaccounts: ['list', 'add', 'info', 'update', 'delete', 'pause', 'resume'],                        // 17
            inbound: ['domains', 'add-domain', 'check-domain', 'delete-domain', 'routes', 'add-route', 'update-route', 'delete-route', 'send-raw'],
            exports: ['info', 'list', 'rejects', 'whitelist', 'activity'],                                      // 19
            ips: ['list', 'info', 'provision', 'start-warmup', 'cancel-warmup', 'set-pool', 'delete', 'list-pools', 'pool-info', 'create-pool', 'delete-pool', 'check-custom-dns', 'set-custom-dns'],
            metadata: ['list', 'add', 'update', 'delete']                                                       // 21
        };                                                                                                      // 22
        var headers = {                                                                                         // 23
            'User-Agent': 'Meteor package wylio:mandrill/1.0.0'                                                 // 24
        };                                                                                                      // 25
                                                                                                                // 26
        var instance = this;                                                                                    // 27
        instance.options.username = options["username"];                                                        // 28
        instance.options.key = options["key"];                                                                  // 29
        instance.options.port = options["port"] || "465";                                                       // 30
        instance.options.host = "smtp.mandrillapp.com";                                                         // 31
        instance.options.baseUrl = options.baseUrl || 'https://mandrillapp.com/api/1.0/';                       // 32
        // set the environment SMTP server                                                                      // 33
        process.env.MAIL_URL = "smtp://" + this.options.username + ":" + this.options.key + "@" + this.options.host + ":" + this.options.port;
                                                                                                                // 35
        // wrap the full Mandrill API                                                                           // 36
        Object.keys(categories).forEach(function (category) {                                                   // 37
            instance[category] = {};                                                                            // 38
            categories[category].forEach(function (call) {                                                      // 39
                // converting to camelCase is for our convenience; Mandrill takes https://mandrillapp.com/api/1.0/messages.sendTemplate.json as well as https://mandrillapp.com/api/1.0/messages.send-template.json
                var camelCaseName = call.replace(/-(.)/g, function (match, p1) {                                // 41
                    return p1.toUpperCase()                                                                     // 42
                });                                                                                             // 43
                instance[category][camelCaseName] = function (options, callback) {                              // 44
                    var url = instance.options.baseUrl + category + '/' + call + '.json';                       // 45
                    options = options || {};  // the ping call has no options to send                           // 46
                    options.key = options.key || instance.options.key;                                          // 47
                                                                                                                // 48
                    // perform an async call if a callback is provided, or return the result otherwise          // 49
                    if (!!callback) {                                                                           // 50
                        HTTP.post(url, {data: options, headers: headers}, callback);                            // 51
                    } else {                                                                                    // 52
                        return HTTP.post(url, {data: options, headers: headers});                               // 53
                    }                                                                                           // 54
                    // ^^ that is all this package really does, but we needed a package, didn't we?             // 55
                }                                                                                               // 56
            });                                                                                                 // 57
        });                                                                                                     // 58
    },                                                                                                          // 59
                                                                                                                // 60
    sendTemplate: function (options) {                                                                          // 61
        console.error('Please see the "Breaking changes" section in the wylio:mandrill README');                // 62
        process.exit(1);                                                                                        // 63
    }                                                                                                           // 64
};                                                                                                              // 65
                                                                                                                // 66
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['wylio:mandrill'] = {}, {
  Mandrill: Mandrill
});

})();
