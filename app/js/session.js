export default Ember.Deferred.extend({
    restApi: null,
    users: null,

    user: null,
    usernameBinding: 'user.username',
    keyBinding: 'user.key',

    isLoggedIn: function () {
        return !Ember.isEmpty(this.get('username'));
    }.property('username'),

    init: function () {
        this._super();

        var settings = {};

        var sessionKey = sessionStorage.getItem('key');

        if (!Ember.isEmpty(sessionKey)) {
            var self = this;
            settings.beforeSend = function(xhr) {
                xhr.setRequestHeader(self.get('restApi').get('apiKeyRequestHeaderName'), sessionKey);
            };
        }

        this._invokeLogin('users.getAuthenticationInfo', this, settings);
    },

    tryLogIn: function() {
        return this.logIn();
    },

    logIn: function(username, password) {
        var result = Ember.Deferred.create();
        var settings = {};

        if (!Ember.isEmpty(username)) {
            settings.beforeSend = function(xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
            };
        }

        this._invokeLogin('users.getRequiredAuthenticationInfo', result, settings);
        return result;
    },

    _invokeLogin: function (apiName, result, settings) {
        var self = this;
        var user = this.get('users').createModel();

        var allSettings = {
            success: function (json) {
                json = json || {};
                json.roles = Ember.A(json.roles || []);
                user.setProperties(json);
                user.resolve(user);
                self.set('user', user);
                sessionStorage.setItem('key', user.get('key'));
                result.resolve(self);
            }
        };

        $.extend(allSettings, settings || {});

        this.get('restApi').then(function (restApi) {
            var call = restApi.ajax(apiName, allSettings);

            call.fail(function(xhr, statusText) {
                sessionStorage.removeItem('key');
                self.set('user', null);

                var error = { message: statusText, request: xhr };
                user.reject(error);
                result.reject(error);
            });
        });

    }
});
