import Resolver from 'ember/resolver';
import Footer from 'views/footer';
import PackageIcon from 'views/packageIcon';
import CheckboxGroup from 'views/checkboxGroup';
import CodeSnippetComponent from 'views/codeSnippetComponent';
import FocusInputComponent from 'views/focusInputComponent';
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

    // TODO: make property of user adapter or model or something
    roles: Ember.A([
        { name: 'PackageManager', label: 'Package Manager' },
        { name: 'AccountAdministrator', label: 'Account Administrator' }
    ])
});

KlondikeApp.initializer(Dependencies);

export default KlondikeApp;
