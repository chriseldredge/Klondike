import Ember from 'ember';

export default Ember.View.extend({
    templateName: 'footer',
    tagName: 'footer',
    contentBinding: 'controller.indexer.status',
    version: function() {
        var app = this.get('application');
        var status = app.get('git-status');
        var commit = status.commit;
        if (status.dirty) {
            commit += '-dirty';
        }
        return app.get('version') + ' (' + commit + ')';
    }.property('application.version', 'application.revision')
});
