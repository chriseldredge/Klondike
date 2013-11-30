/*
    Note: to use a remote api, the remote server must be configured
    for Cross Origin Resource Sharing (CORS). Administrative actions
    such as pushing or deleting packages require an api key, but
    read-only operations do not.
*/
(function (app) {

    app.config = app.config || {};
    
    app.config.apiKey = app.config.apiKey || '';

    // Note: must end with trailing slash:
    var appPath = window.location.pathname.replace(/[^\\\/]*$/, '');
    
    app.config.baseDataUrl = app.config.baseDataUrl || (appPath + 'api/');
}(App));