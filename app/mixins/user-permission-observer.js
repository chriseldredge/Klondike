import Ember from 'ember';
import describePromise from 'klondike/util/describe-promise';

export default Ember.Mixin.create({
    _permissionObservers: [],

    init: function() {
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

            self.set(observer.property, result);
            return result;
        }, null, describePromise(this, '_updateUserPermission'));
    },

    _sessionUserDidChange: Ember.observer('session.user', function() {
        this.get('_permissionObservers').forEach(this._updateUserPermission, this);
    })
});
