(function (em, app) {
    app.Footer = em.View.extend({
        templateName: 'footer',
        tagName: 'footer',
        contentBinding: 'App.PackageIndexer.status'
    });
}(Ember, App));