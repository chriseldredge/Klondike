define([
        'ember',
        'config',
        'restapi',
        'controllers/adminController',
        'controllers/applicationController',
        'controllers/baseControllerMixin',
        'controllers/searchController',
        'models/packageIndexer',
        'models/packageStore',
        'models/restClient',
        'routes/adminRoute',
        'routes/searchRoute',
        'routes/viewPackageRoute',
        'views/footer',
        'views/packageIcon'
], function (em, config, restapi, adminController, applicationController, baseControllerMixin, searchController, packageIndexer, packageStore, restClient, adminRoute, searchRoute, viewPackageRoute, footer, packageIcon) {
    var app = em.Application.create({
        name: "NuGet",
        //LOG_ACTIVE_GENERATION: true,
        //LOG_TRANSITIONS: true,
        //LOG_TRANSITIONS_INTERNAL: true
    });
    
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
    app.IndexController = em.Controller.extend(baseControllerMixin);
    app.PackagesSearchController = searchController;
    app.PackagesViewController = em.ObjectController.extend(baseControllerMixin);;
    
    app.AdminRoute = adminRoute;
    app.PackagesSearchRoute = searchRoute;
    app.PackagesViewRoute = viewPackageRoute;

    app.Footer = footer;
    app.PackageIcon = packageIcon;

    return app;
});