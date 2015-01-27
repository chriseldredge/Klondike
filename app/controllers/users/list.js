import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';
import UserPermissionObserver from 'klondike/mixins/user-permission-observer';

export default Ember.Controller.extend(BaseControllerMixin, UserPermissionObserver, {
    canEdit: false,

    init: function() {
        this._super();
        this.observeUserPermission('canEdit', 'users.put');
    },

});
