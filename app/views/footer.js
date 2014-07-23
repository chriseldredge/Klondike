import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'footer',
    tagName: 'footer',
    contentBinding: 'controller.indexer.status',
    versionBinding: 'application.version'
});
