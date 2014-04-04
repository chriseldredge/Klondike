import SemanticVersion from 'models/semanticVersion';

export default Ember.Object.extend({
    id: '',
    version: '',
    versionHistory: [],

    displayTitle: function() {
        return this.get('title') || this.get('id');
    }.property('title', 'id'),

    semanticVersion: function() {
        return SemanticVersion(this.get('version'));
    }.property('version')
});
