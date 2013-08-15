define([
        'ember',
        'config',
        'restapi',
        'controllers/adminController',
        'controllers/applicationController',
        'controllers/indexController',
        'controllers/searchController',
        'models/packageIndexer',
        'models/packageStore',
        'models/restClient',
        'routes/adminRoute',
        'routes/searchRoute',
        'routes/viewPackageRoute',
        'views/footer',
        'views/packageIcon'
], function (em, config, restapi, adminController, applicationController, indexController, searchController, packageIndexer, packageStore, restClient, adminRoute, searchRoute, viewPackageRoute, footer, packageIcon) {

    var app = em.Application.create({name: "NuGet"});
    app.deferReadiness();
    
    restapi.then(function () {
        app.advanceReadiness();
    });

    app.RestClient = restClient.create({
        baseUrl: config.baseDataUrl,
        apiKey: config.apiKey,
    });

    app.PackageIndexer = packageIndexer.create({
        restClient: app.RestClient,
    });
    
    app.Packages = packageStore.create({
        restClient: app.RestClient
    });

    app.AdminController = adminController;
    app.ApplicationController = applicationController;
    app.IndexController = indexController;
    app.SearchController = searchController;
    
    app.AdminRoute = adminRoute;
    app.SearchRoute = searchRoute;
    app.ViewPackageRoute = viewPackageRoute;

    app.Footer = footer;
    app.PackageIcon = packageIcon;

    return app;
});