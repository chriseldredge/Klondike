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
            for (var i=0; i<data.length; i++) {
                var name = data[i]['name'].toLowerCase();
                var key = data[i]['method'] + '.' + name;

                if (key in apiInfo) {
                    console.warn('Duplicate api method: ' + key);
                }
                apiInfo[key] = data[i];
            }
            module.set('apiInfo', apiInfo);
            module.resolve(apiInfo);
        }
    });

    return module;
});