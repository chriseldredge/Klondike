define(["app"], function (app) {
    app.Router.map(function () {
        this.route('index', { path: '/' });
        this.route('admin');
        this.resource('packages', function() {
            this.route('search', { path: '/search/:query' });
            this.route('view', { path: '/:id/:version' });
        });
    });

    return app.Router;
});