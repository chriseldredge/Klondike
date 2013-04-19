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
            
            $.ajax(api.href, options);
        }
    });
});