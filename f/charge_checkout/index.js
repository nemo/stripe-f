

/* Import dependencies, declare constants */
var qs = require('qs');
var url = require('url');
var charge = require('../charge');

/**
* Your function call
* @param {Object} params Execution parameters
*   Members
*   - {Array} args Arguments passed to function
*   - {Object} kwargs Keyword arguments (key-value pairs) passed to function
*   - {String} remoteAddress The IPv4 or IPv6 address of the caller
*
* @param {Function} callback Execute this to end the function call
*   Arguments
*   - {Error} error The error to show if function fails
*   - {Any} returnValue JSON serializable (or Buffer) return value
*/

function handleError(err) {}
function handleSuccess(data) {}

module.exports = (params, callback) => {
    var formData = params.buffer && params.buffer.toString() || '';
    var formParams = formData && formData.length && qs.parse(formData) || {};
    var redirectUrlStr = params.kwargs['redirect-url'] || formParams['redirect-url'] || process.env.REDIRECT_URL || '';
    var timeoutDurationStr = params.kwargs['redirect-timeout'] || formParams['redirect-timeout'] || process.env.REDIRECT_TIMEOUT || 0;

    var redirectUrl = url.parse(redirectUrlStr);
    var timeoutDuration = parseInt(timeoutDurationStr);

    if (!redirectUrl) return callback(null, redirectPage("No redirectUrl given!"));

    charge({
        kwargs: formParams
    }, (err, response) => {
        var query;
        if (err)
            query = "payment_error=" + err.message + "&" + "payment_failure=true";
        else
            query = "payment_success=true";

        redirectUrl.query = query + (redirectUrl.query && redirectUrl.query.length ? ("&" + redirectUrl.query) : '');
        redirectUrl.search = "?" + redirectUrl.query;

        var redirectUrlPath = url.format(redirectUrl);

        if (err) return callback(null, redirectPage(((err || {}).message) || "Something went wrong! Payment wasn't processed", redirectUrlPath, timeoutDuration));
        else return callback(null, redirectPage(response.message, redirectUrlPath, timeoutDuration));
    });
};

function redirectPage(message, redirectUrl, timeout) {
    return new Buffer(`<!DOCTYPE html>
<html>
    <head>
        <title>Example</title>
        <meta http-equiv="refresh" content="${timeout}; url=${redirectUrl}" />
        <script>
            function init() {
               setTimeout(function() {
                   window.location.href = "${redirectUrl}";
               }, ${(timeout || 0) * 1000})
            }
        </script>
    </head>

    <body onload="init()">
        <p style="text-align: center; margin-top: 50px; font-size: 1rem;">${message}. You'll be redirected shortly. If not, click <a href="${redirectUrl}">here</a>.</p>
    </body>
</html>
    `);
}
