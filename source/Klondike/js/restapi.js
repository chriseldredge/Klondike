define(['require', 'config', 'ember', 'jquery'], function (require, config, em, jQuery) {
    var module = em.Object.extend(em.DeferredMixin, {
        apiInfo: [],
        getApi: function (apiName, method) {
            if (!method) {
                method = "GET";
            }
            var key = method + '.' + apiName.toLowerCase();
            return this.get('apiInfo')[key];
        }
    }).create();

    var url = config.baseDataUrl;

    jQuery.ajax(url, {
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
                    
                    apiInfo[key] = action;
                }
            }
            module.set('apiInfo', apiInfo);
            module.resolve(apiInfo);
        }
    });

    return module;
});
