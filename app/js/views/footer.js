export default Ember.View.extend({
    templateName: 'footer',
    tagName: 'footer',
    contentBinding: 'App.packageIndexer.status',
    versionBinding: 'App.version'
});
