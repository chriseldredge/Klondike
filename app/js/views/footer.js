export default Ember.View.extend({
    templateName: 'footer',
    tagName: 'footer',
    contentBinding: 'controller.indexer.status',
    versionBinding: 'App.version'
});
