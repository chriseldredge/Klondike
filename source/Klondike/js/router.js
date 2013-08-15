require(["app"], function (app) {
    app.Router.map(function () {
        this.route('index', { path: '/' });
        this.route('admin');
        this.route('search', { path: '/package/search/:query' });
        this.route('viewPackage', { path: '/package/:id/:version' });
    });
});