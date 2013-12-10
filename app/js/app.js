import config from 'config';
import Resolver from 'resolver';
import RestApi from 'restApi';
import Hubs from 'hubs';
import PackageIndexer from 'packageIndexer';
import PackageStore from 'packageStore';
import Session from 'session';
import Footer from 'views/footer';
import PackageIcon from 'views/packageIcon';
import CheckboxGroup from 'views/checkboxGroup';
import UserStore from 'userStore';

export default Ember.Application.extend({
    Resolver: Resolver,
    Footer: Footer,
    PackageIcon: PackageIcon,
    CheckboxGroup: CheckboxGroup,

    //LOG_ACTIVE_GENERATION: true,
    //LOG_TRANSITIONS: true,
    //LOG_TRANSITIONS_INTERNAL: true,

    name: "NuGet",
    modulePrefix: 'appkit',
    restApi: null,
    packageIndexer: null,
    packages: null,
    session: null,
    roles: Ember.A([
        { name: 'PackageManager', label: 'Package Manager' },
        { name: 'AccountAdministrator', label: 'Account Administrator' }
    ]),

    init: function() {
        var restApi = RestApi.create({apiUrl: config.apiUrl});

        this.set('restApi', restApi);

        var hubs = Hubs.create({restApi: restApi});

        this.set('packageIndexer', PackageIndexer.create({
            restApi: restApi,
            hubs: hubs
        }));

        this.set('packages', PackageStore.create({restApi: restApi}));
        this.set('users', UserStore.create({restApi: restApi}));
        this.set('session', Session.create({restApi: restApi, users: this.get('users')}));

        this._super();
    }
});
