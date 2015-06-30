import Ember from 'ember';
import ApplicationException from 'klondike/application-exception';
import describePromise from 'klondike/util/describe-promise';

var RestApi = Ember.Service.extend({
    apiKeyRequestHeaderName: 'X-NuGet-ApiKey',

    apiURLBinding: 'application.apiURL',
    apiKeyBinding: 'application.apiKey',

    apiInfo: {},
    packageSourceUri: null,

    simulateRequestLatency: 0,

    _promise: null,

    init: function() {
        var url = this.get('apiURL') + '?nocache=' + new Date().getTime();

        var deferred = Ember.RSVP.defer(describePromise(this, 'init', [url]));
        this.set('_promise', deferred.promise);

        var self = this;

        var data = {
            type: 'GET',
            success: function (data) {
                self.set('apiInfo', self._buildApiDictionary(data));
                self._setPackageSource();
                deferred.resolve(self);
            }
        };

        Ember.$.ajax(url, data).fail(function(xhr, status) {
            deferred.reject('ajax call to ' + url + ' failed: ' + status + '(' + xhr.status + ')');
        });
    },

    getApi: function (apiName, method) {
        var self = this;

        return self.get('_promise').then(function() {
            return self._lookupApi(apiName, method);
        }, null, describePromise(this, 'getApi', arguments));
    },

    ajax: function (apiName, options) {
        options = options || {};
        var method;
        if ('type' in options) {
            method = options.type;
        }

        var self = this;

        var timeout = self.get('simulateRequestLatency') || 0;

        var invoke = function() {
            return self.getApi(apiName, method).then(function(api) {
                return self._invokeAjaxApi(apiName, api, options);
            }, null, describePromise(self, 'ajax', [apiName]));
        };

        if (timeout) {
            var deferred = Ember.RSVP.defer(describePromise(this, 'ajax') + ': Simulate Request Latency');

            setTimeout(function() { deferred.resolve(); }, timeout);

            return deferred.promise.then(invoke, null, describePromise(this, 'ajax', [apiName]) + ': Invoke');
        } else {
            return invoke();
        }
    },

    _invokeAjaxApi: function(apiName, api, options) {
        if (!api) {
            throw new ApplicationException('Rest API method not found: ' + apiName);
        }

        var self = this;

        options.type = api.method;

        var apiKey = this.get('apiKey');

        if (!Ember.isEmpty(apiKey)) {
            var origBeforeSend = options.beforeSend;
            options.beforeSend = function(xhr) {
                xhr.setRequestHeader(self.get('apiKeyRequestHeaderName'), apiKey);
                if (origBeforeSend) {
                    origBeforeSend(xhr);
                }
            };
        }

        var href = this._replaceParameters(api, options);

        return new Ember.RSVP.Promise(function(resolve, reject) {
            options.success = function(data) {
                resolve(data);
            };

            Ember.$.ajax(href, options).fail(function(request, textStatus, errorThrown) {
                var error = {
                  request: request,
                  textStatus: textStatus,
                  errorThrown: errorThrown };

                if (request && request.status) {
                  error.status = request.status;
                }

                if (request && request.responseJSON) {
                  error.response = request.responseJSON;
                }

                reject(error);
            });
        }, describePromise(this, '_invokeAjaxApi', [apiName]));
    },

    _lookupApi: function(apiName, method) {
        var apiInfo = this.get('apiInfo');
        apiName = apiName.toLowerCase();

        if (method) {
            var fullKey = method + '.' + apiName;
            return apiInfo[fullKey];
        }

        var pattern = new RegExp('^\\w+\\.' + apiName.replace('.', '\\.') + '$');
        var matches = [];
        for (var key in apiInfo) {
            if (key.match(pattern)) {
                matches.push(apiInfo[key]);
            }
        }

        if (matches.length === 0) {
            throw new ApplicationException('no method matching ' + pattern);
        } else if (matches.length > 1) {
            throw new ApplicationException('multiple APIs matched ' + apiName + '; must specify HTTP method');
        }

        return matches[0];
    },

    _replaceParameters: function (api, options) {
        // replace {foo} with options.data.foo
        return api.href.replace(/\{[^\}]+\}/g, function (param) {
            // {foo} -> foo
            param = param.substring(1, param.length - 1);

            if (!(param in options.data)) {
                throw new ApplicationException('Must specify required parameter "' + param + '" for REST method "' + api.name + '"');
            }

            var value = options.data[param];
            delete options.data[param];
            return value;
        });
    },

    _setPackageSource: function () {
        var href = this.get('apiURL');

        if (href[href.length - 1] !== '/') {
            href += '/';
        }

        if (href.indexOf('//') === -1) {
            href = window.location.protocol + '//' + window.location.host + href;
        }

        this.set('packageSourceUri', href);
    },

    _hrefToAbsolute: function(href) {
        if (href.indexOf('://') !== -1) {
            return href;
        }

        var dataUrl = this.get('_fullBaseDataUrl');

        if (href[0] !== '/') {
            return dataUrl + href;
        }

        return dataUrl.replace(/(.+:\/\/[^/]+).*/, '$1' + href);
    },

    _fullBaseDataUrl: function() {
        var base = this.get('apiURL');

        if (base.indexOf('://') === -1) {
            base = window.location.protocol + '//' + window.location.host + base;
        }

        if (base[base.length - 1] !== '/') {
            base += '/';
        }

        return base;
    }.property('apiURL'),

    _buildApiDictionary: function(data) {
        var apiInfo = {};
        for (var i = 0; i < data.resources.length; i++) {
            var res = data.resources[i];
            var name = res.name.toLowerCase();
            for (var j = 0; j < res.actions.length; j++) {
                var action = res.actions[j];
                var key = action.method + '.' + name.toLowerCase() + '.' + action.name.toLowerCase();
                if (key in apiInfo) {
                    console.warn('Duplicate api method: ' + key);
                }

                action.href = this._hrefToAbsolute(action.href);
                apiInfo[key] = action;
            }
        }
        return apiInfo;
    }
});

export default RestApi;
