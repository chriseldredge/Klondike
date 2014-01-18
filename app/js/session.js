export default Ember.Deferred.extend({
    restApi: null,
    users: null,

    user: null,
    usernameBinding: 'user.username',
    keyBinding: 'user.key',
    rolesBinding: 'user.roles',
    isInitialized: false,

    isLoggedIn: function () {
        return !Ember.isEmpty(this.get('username'));
    }.property('username'),

    init: function () {
        this._super();

        var self = this;
        var settings = {};
        var sessionKey = sessionStorage.getItem('key');

        if (!Ember.isEmpty(sessionKey)) {
            settings.beforeSend = function(xhr) {
                xhr.setRequestHeader(self.get('restApi').get('apiKeyRequestHeaderName'), sessionKey);
            };
        }

        self._invokeLogin('users.getAuthenticationInfo', settings)
            .then(function() {
                self.set('isInitialized', true);
                self.resolve(self);
            })
            .catch(function() {
                self.set('isInitialized', true);
                self.resolve(self);
            });
    },

    isAllowed: function(apiName, method) {
        var self = this;

        return this.get('restApi').getApi(apiName, method).then(function (api) {
            if (!api.requiresAuthentication) {
                return true;
            }

            var userRoles = self.get('user.roles') || [];
            var userRoleMissing = function(roleName) {
                return !userRoles.contains(roleName);
            };

            var any = api.requiresRoles.any(function(roleSet) {
                return roleSet.any(userRoleMissing);
            });

            return !any;
        });
    },

    logOut: function() {
        this.set('user', null);
    },

    tryLogIn: function() {
        return this.logIn().then(function() {
            return true;
        }).catch(function() {
            return false;
        });
    },

    logIn: function(username, password) {
        var settings = {};

        if (!Ember.isEmpty(username)) {
            settings.beforeSend = function(xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ':' + password));
            };
        }

        return this._invokeLogin('users.getRequiredAuthenticationInfo', settings);
    },

    _invokeLogin: function (apiName, settings) {
        var self = this;

        return Ember.Deferred.promise(function(deferred) {
            return self.get('restApi').ajax(apiName, settings)
                .catch(function(error) {
                    self.set('user', null);
                    deferred.reject(error);
                })
                .then(function(json) {
                    json = json || {};
                    json.roles = Ember.A(json.roles || []);

                    var user = self.get('users').createModel(json);

                    self.set('user', user);

                    deferred.resolve(user);
                });
        });
    },

    _keyDidChange: function() {
        var key = this.get('key');
        if (key) {
            sessionStorage.setItem('key', key);
        } else {
            sessionStorage.removeItem('key');
        }
    }.observes('key'),
});
