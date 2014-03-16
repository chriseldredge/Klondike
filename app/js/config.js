/*
    Note: to use a remote api, the remote server must be configured
    for Cross Origin Resource Sharing (CORS). Administrative actions
    such as pushing or deleting packages require an api key, but
    read-only operations do not.
*/
var config = {
    apiUrl: '',
    apiKey: ''
};

if (config.apiUrl.indexOf('://') === -1 && window && 'location' in window) {
    config.apiUrl = window.location.pathname.replace(/[^\\\/]*$/, '') + 'api/';
}

export default config;
