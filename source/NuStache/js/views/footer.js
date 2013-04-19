define(['ember'], function (em) {
    return em.View.extend({
        templateName: 'footer',
        tagName: 'footer',
        contentBinding: 'App.PackageIndexer.status'
    });
});