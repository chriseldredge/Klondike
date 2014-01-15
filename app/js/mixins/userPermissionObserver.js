export default Ember.Mixin.create({
    _permissionObservers: [],

    init: function() {
        if (!this.get('session')) {
            if (typeof(App)==='undefined') {
                throw 'Must explicitly set session property on ' + Ember.inspect(this) +
                    ' or App.session must be available before init() is invoked.';
            }
            var sessionBinding = Ember.Binding.oneWay('App.session').to('session');
            sessionBinding.connect(this);
        }
        this.set('_permissionObservers', []);
        this._super();
    },

    observeUserPermission: function(property, apiName, method) {
        var observer = { property: property, apiName: apiName, method: method };
        this.get('_permissionObservers').push(observer);
        this._updateUserPermission(observer);
    },

    _updateUserPermission: function(observer) {
        var self = this;
        this.get('session').isAllowed(observer.apiName, observer.method).then(function(result) {
            var prevResult = self.get(observer.property);
            if (result===prevResult) {
                return;
            }
            console.debug(observer.property, prevResult, '=>', result);
            self.set(observer.property, result);
        }).then(null, function(error) {
            console.error(error);
        });
    },

    _sessionUserDidChange: function() {
        this.get('_permissionObservers').forEach(this._updateUserPermission, this);
    }.observes('session.user')
});
