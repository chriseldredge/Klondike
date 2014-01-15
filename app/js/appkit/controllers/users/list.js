import BaseControllerMixin from 'mixins/baseControllerMixin';
import UserPermissionObserver from 'mixins/userPermissionObserver';

export default Ember.Controller.extend(BaseControllerMixin, UserPermissionObserver, {
    canEdit: false,

    init: function() {
        this._super();
        this.observeUserPermission('canEdit', 'users.put');
    },

});
