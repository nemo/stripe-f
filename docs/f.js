var f = (function() {

  function parseArgList(argList) {

    var args;
    var kwargs = {};

    if (typeof argList[argList.length - 1] === 'object' && argList[argList.length - 1] !== 'null') {
      kwargs = argList.pop();
    }

    args = argList.slice();

    return JSON.stringify({
      args: args,
      kwargs: kwargs
    });

  }

  function f(name, mode, config) {

    mode = mode || 'json';
    config = config || f.config;

    return function external() {

      var argList = [].slice.call(arguments);
      var callback = function() {};
      var payload;
      var headers;
      var req;

      if (typeof argList[argList.length - 1] === 'function') {
        callback = argList.pop();
      }

      if (mode === 'json') {
        headers = {'Content-Type': 'application/json'};
        payload = parseArgList(argList);
      } else if (mode === 'command') {
        headers = {'Content-Type': 'application/command'};
        payload = argList[0];
      } else if (mode === 'file') {
        headers = {'Content-Type': 'application/octet-stream'};
        payload = argList[0];
      } else {
        return callback(new Error('Invalid function mode: ' + mode));
      }

      var xhr = new XMLHttpRequest();
      xhr.open(
        'POST',
        '//' + config.gateway.host +
        (config.gateway.port ? ':' + config.gateway.port : '') +
        config.gateway.path + name
      );
      Object.keys(headers).forEach(function(h) { xhr.setRequestHeader(h, headers[h]); });
      xhr.addEventListener('readystatechange', function() {

        if (xhr.readyState === 0) {
          return callback(new Error('Request aborted.'));
        }

        if (xhr.readyState === 4) {

          if (xhr.status === 0) {
            return callback(new Error('Could not run function.'));
          }

          var response = xhr.responseText;
          var contentType = xhr.getResponseHeader('content-type');

          if (contentType === 'application/json') {
            try {
              response = JSON.parse(response);
            } catch(e) {
              response = null;
            }
          } else if (contentType.match(/^text\/.*$/i)) {
            response = response;
          } else {
            response = new Blob([response], {type: contentType});
          }

          if (((xhr.status / 100) | 0) !== 2) {
            return callback(new Error(response));
          } else {
            return callback(null, response);
          }

        }

      });

      xhr.send(payload);

    };

  };

  f.config = {
    gateway: {
      host: 'f.stdlib.com',
      port: '',
      path: '/'
    }
  };

  return f;

})();
