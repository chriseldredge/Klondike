import config from 'config';
import Resolver from 'ember/resolver';
import RestApi from 'appkit/services/rest-client';
import PackageStore from 'packageStore';
import Footer from 'views/footer';
import PackageIcon from 'views/packageIcon';
import CheckboxGroup from 'views/checkboxGroup';
import CodeSnippetComponent from 'views/codeSnippetComponent';
import FocusInputComponent from 'views/focusInputComponent';
import UserStore from 'userStore';
import Dependencies from 'initializers/dependencies';

Ember.Handlebars.registerBoundHelper('format-date', function(date, options) {
    var format = options.hash.format || 'dddd, MMMM Do YYYY, HH:mm:ss A Z'
    return moment(date).format(format);
});

var KlondikeApp = Ember.Application.extend({
    Resolver: Resolver,
    Footer: Footer,
    PackageIcon: PackageIcon,
    CheckboxGroup: CheckboxGroup,
    CodeSnippetComponent: CodeSnippetComponent,
    FocusInputComponent: FocusInputComponent,

    //LOG_ACTIVE_GENERATION: true,
    //LOG_TRANSITIONS: true,
    //LOG_TRANSITIONS_INTERNAL: true,

    name: 'NuGet',
    modulePrefix: 'appkit',
    restApi: null,
    packageIndexer: null,
    packages: null,
    roles: Ember.A([
        { name: 'PackageManager', label: 'Package Manager' },
        { name: 'AccountAdministrator', label: 'Account Administrator' }
    ]),

    init: function() {
        var restApi = RestApi.create({apiUrl: config.apiUrl});

        this.set('packages', PackageStore.create({restApi: restApi}));
        this.set('users', UserStore.create({restApi: restApi}));

        this._super();
    }
});

KlondikeApp.initializer(Dependencies);

export default KlondikeApp;
