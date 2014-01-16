var Router = Ember.Router.extend();

Router.map(function () {
    this.route('index', { path: '/' });
    this.route('login');
    this.route('denied');
    this.route('profile');
    this.route('admin');
    this.resource('packages', function() {
        this.route('search', { path: '/search/:query' });
        this.route('view', { path: '/:id/:version' });
    });
    this.resource('users', function() {
        this.route('list', { path: '/' });
        this.route('add', { path: '/add' });
        this.route('edit', { path: '/edit/*username' });
    });
});

export default Router;
