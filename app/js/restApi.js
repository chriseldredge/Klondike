var RestApi = Ember.Deferred.extend({
    apiKeyRequestHeaderName: 'X-NuGet-ApiKey',

    apiUrl: null,
    session: null,

    apiInfo: {},
    packageSourceUri: null,

    init: function() {
        var url = this.get('apiUrl');

        if (!url) {
            throw 'Must set apiUrl property on RestApi.';
        }

        console.log('Loading ajax api info from', url);
        var self = this;

        var data = {
            type: 'GET',
            success: function (data) {
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

                        action.href = self._hrefToAbsolute(action.href);
                        apiInfo[key] = action;
                    }
                }
                self.set('apiInfo', apiInfo);
                if (self._setPackageSource()) {
                    self.resolve(self);
                }
            },
        };

        $.ajax(url, data).fail(function(xhr, status, error) {
            self.reject("ajax call to " + url + " failed: " + status + "(" + xhr.status + ")");
        });
    },

    getApi: function (apiName, method) {
        var apiInfo = this.get('apiInfo');
        apiName = apiName.toLowerCase();

        if (method) {
            var key = method + '.' + apiName;
            return apiInfo[key];
        }

        var pattern = new RegExp('^\\w+\\.' + apiName.replace('.', '\\.') + '$');
        var matches = [];
        for (var key in apiInfo) {
            if (key.match(pattern)) {
                matches.push(apiInfo[key]);
            }
        }

        if (matches.length == 0) {
            throw 'no method matching ' + pattern;
        } else if (matches.length > 1) {
            throw 'multiple APIs matched ' + apiName + '; must specify HTTP method';
        }

        return matches[0];
    },

    ajax: function (apiName, options) {
        options = options || {};
        var method = 'GET';
        if ('type' in options) {
            method = options.type;
        }

        var api = this.getApi(apiName, method);

        if (!api) {
            throw 'Rest API method not found: ' + apiName;
        }

        var self = this;

        options.type = api.method;

        var apiKey = this.get('session').get('key');

        if (!Ember.isEmpty(apiKey)) {
            var origBeforeSend = options['beforeSend'];
            options.beforeSend = function(xhr) {
                xhr.setRequestHeader(self.get('apiKeyRequestHeaderName'), apiKey);
                if (origBeforeSend) {
                    origBeforeSend(xhr);
                }
            };
        }

        var href = this._replaceParameters(api, options);

        return $.ajax(href, options);
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
        var api = this.getApi('Packages.OData');
        if (!api) {
            this.reject('Failed to locate Packages.OData api endpoint.');
            return false;
        }

        var href = api.href;

        if (href[href.length - 1] !== '/') {
            href += '/';
        }

        if (href.indexOf('//') == -1) {
            href = window.location.protocol + '//' + window.location.host + href;
        }
        this.set('packageSourceUri', href);
        return true;
    },

    _hrefToAbsolute: function(href) {
        if (href.indexOf('://') !== -1) {
            return href;
        }

        var dataUrl = this.get('_fullBaseDataUrl');

        if (href[0] !== '/') {
            return dataUrl + href;
        }

        return dataUrl.replace(/(.+:\/\/[^/]+).*/, "$1" + href);
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
    }.property('apiUrl')
});

export default RestApi;
