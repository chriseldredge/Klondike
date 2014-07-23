import Ember from 'ember';

export default Ember.Object.extend({
    idBinding: 'username',
    username: '',
    key: '',
    roles: Ember.A(),
    allRoles: Ember.A([
        { name: 'PackageManager', label: 'Package Manager' },
        { name: 'AccountAdministrator', label: 'Account Administrator' }
    ])
});
