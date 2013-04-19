/*
    Note: to use a remote api, the remote server must be configured
    for Cross Origin Resource Sharing (CORS). Administrative actions
    such as pushing or deleting packages require an api key, but
    read-only operations do not.
*/
define([], function () {
    return {
        baseDataUrl: 'http://nustache.com/api/',
        apiKey: ''
    };
});