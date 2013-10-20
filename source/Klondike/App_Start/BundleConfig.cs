using System.Web.Optimization;

[assembly: WebActivator.PreApplicationStartMethod(typeof(Klondike.BundleConfig), "RegisterBundles")]

namespace Klondike
{
    public static class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles()
        {
            var bundles = BundleTable.Bundles;

            bundles.Add(new StyleBundle("~/css/bundle.css").Include(
                      "~/css/bootstrap-{version}.css",
                      "~/css/app.css"));

            bundles.Add(new ScriptBundle("~/js/bundle.js").Include(
                      "~/js/vendor/jquery-{version}.js",
                      "~/js/vendor/jquery.signalR-{version}.js",
                      "~/js/vendor/handlebars-{version}.js",
                      "~/js/vendor/ember-{version}.js",
                      "~/js/app.js",
                      "~/js/config.js",
                      "~/js/restApi.js",
                      "~/js/hubs.js",
                      "~/js/models/restClient.js",
                      "~/js/models/searchResults.js",
                      "~/js/models/paginationSupport.js",
                      "~/js/models/packageStore.js",
                      "~/js/models/packageIndexer.js",
                      "~/js/controllers/baseControllerMixin.js",
                      "~/js/controllers/packagesSearchController.js",
                      "~/js/controllers/adminController.js",
                      "~/js/controllers/applicationController.js",
                      "~/js/views/*.js",
                      "~/js/routes/*.js",
                      "~/js/router.js"
                      
            ));
        }
    }
}
