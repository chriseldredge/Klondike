define(['ember', 'restapi'], function (em, restapi) {
    return em.Object.extend(em.DeferredMixin, {
        baseUrl: '',
        apiKey: '',
        ajax: function (apiName, options) {
            var method = 'GET';
            if ('type' in options) {
                method = options.type;
            }

            var api = restapi.getApi(apiName, method);
            
            if (!api) {
                throw 'Rest API method not found: ' + apiName;
            }
            
            options.type = api.method;

            if (this.get('apiKey') !== '') {
                var origBeforeSend = options['beforeSend'];

                options.beforeSend = function(xhr) {
                    xhr.setRequestHeader('X-NuGet-ApiKey', 'example');
                    if (origBeforeSend) {
                        origBeforeSend(xhr);
                    }
                };
            }

            var href = this.replaceParameters(api, options);
            
            $.ajax(href, options);
        },
        replaceParameters: function (api, options) {
            // replace {foo} with options.data.foo
            return api.href.replace(/\{[^\}]+\}/g, function (param) {
                // {foo} -> foo
                param = param.substring(1, param.length - 1);
                
                if (!(param in options.data)) {
                    throw 'must specify required parameter "' + param + '" for REST method "' + api.name + '"';
                }
                
                var value = options.data[param];
                delete options.data[param];
                return value;
            });
        }
    });
});