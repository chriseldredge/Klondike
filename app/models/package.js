import Ember from 'ember';
import SemanticVersion from './semantic-version';

export default Ember.Object.extend({
    id: '',
    version: '',
    versionHistory: [],

    displayTitle: function() {
        return this.get('title') || this.get('id');
    }.property('title', 'id'),

    semanticVersion: function() {
        return SemanticVersion.create({version: this.get('version')});
    }.property('version')
});
