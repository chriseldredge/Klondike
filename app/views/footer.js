import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'footer',
    tagName: 'footer',
    contentBinding: 'controller.indexer.status',
    version: function() {
        var app = this.get('application');
        return app.get('version') + ' (' + app.get('revision') + ')';
    }.property('application.version', 'application.revision')
});
