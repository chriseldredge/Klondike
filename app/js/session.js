export default Ember.Deferred.extend({
    restApi: null,
    users: null,

    user: null,
    usernameBinding: 'user.username',
    keyBinding: 'user.key',
    rolesBinding: 'user.roles',

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

    isAllowed: function(apiName, method) {
        var self = this;
        var result = Ember.Deferred.create();

        this.get('restApi').then(function (restApi) {
            var api = restApi.getApi(apiName, method);

            if (!api.requiresAuthentication) {
                result.resolve(true);
                return;
            }

            var userRoles = self.get('user.roles') || [];
            var userRoleMissing = function(roleName) {
                return !userRoles.contains(roleName);
            };

            var any = api.requiresRoles.any(function(roleSet) {
                return roleSet.any(userRoleMissing);
            });

            result.resolve(!any);
        }).then(null, function(error) {
            result.reject(error);
        });

        return result;
    },

    logOut: function() {
        sessionStorage.removeItem('key');
        this.set('user', null);
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
                self.logOut();

                var error = { message: statusText, request: xhr };
                user.reject(error);
                result.reject(error);
            });
        });

    }
});
