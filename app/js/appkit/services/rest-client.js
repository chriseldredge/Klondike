import config from 'config';

var RestApi = Ember.Deferred.extend({
    apiKeyRequestHeaderName: 'X-NuGet-ApiKey',

    apiUrl: config.apiUrl,
    apiKey: config.apiKey,

    apiInfo: {},
    packageSourceUri: null,

    simulateRequestLatency: 0,

    init: function() {
        var url = this.get('apiUrl') + '?nocache=' + new Date().getTime();

        if (!url) {
            throw 'Must set apiUrl property on RestApi.';
        }

        console.log('Loading ajax api info from', url);
        var self = this;

        var data = {
            type: 'GET',
            success: function (data) {
                self.set('apiInfo', self._buildApiDictionary(data));
                self._setPackageSource();
                self.resolve(self);
            },
            fail: function(xhr, status) {
                self.reject('ajax call to ' + url + ' failed: ' + status + '(' + xhr.status + ')');
            }
        };

        $.ajax(url, data);
    },

    getApi: function (apiName, method) {
        var self = this;

        return this.then(function() {
            return self._lookupApi(apiName, method);
        });
    },

    ajax: function (apiName, options) {
        options = options || {};
        var method;
        if ('type' in options) {
            method = options.type;
        }

        var self = this;

        var delay = Ember.Deferred.promise(function(deferred) {
            var timeout = self.get('simulateRequestLatency') || 0;

            if (timeout) {
                setTimeout(function() {
                    deferred.resolve();
                }, 2000);
            } else {
                deferred.resolve();
            }
        });

        return delay.then(function() {
            return self.getApi(apiName, method);
        }).then(function(api) {
            return self._invokeAjaxApi(apiName, api, options);
        });
    },

    _invokeAjaxApi: function(apiName, api, options) {
        if (!api) {
            throw 'Rest API method not found: ' + apiName;
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

        return Ember.Deferred.promise(function(deferred) {
            options.success = function(data) {
                deferred.resolve(data);
            };

            Ember.$.ajax(href, options).fail(function(request, textStatus, errorThrown) {
                deferred.reject({ request: request, textStatus: textStatus, errorThrown: errorThrown });
            });
        });
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
            throw 'no method matching ' + pattern;
        } else if (matches.length > 1) {
            throw 'multiple APIs matched ' + apiName + '; must specify HTTP method';
        }

        return matches[0];
    },

    _replaceParameters: function (api, options) {
        // replace {foo} with options.data.foo
        return api.href.replace(/\{[^\}]+\}/g, function (param) {
            // {foo} -> foo
            param = param.substring(1, param.length - 1);

            if (!(param in options.data)) {
                throw 'Must specify required parameter "' + param + '" for REST method "' + api.name + '"';
            }

            var value = options.data[param];
            delete options.data[param];
            return value;
        });
    },

    _setPackageSource: function () {
        var href = this.get('apiUrl');

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
        var base = this.get('apiUrl');

        if (base.indexOf('://') === -1) {
            base = window.location.protocol + '//' + window.location.host + base;
        }

        if (base[base.length - 1] !== '/') {
            base += '/';
        }

        return base;
    }.property('apiUrl'),

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
