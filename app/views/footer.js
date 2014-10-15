import Ember from 'ember';
import config from '../config/environment';

export default Ember.View.extend({
    config: config,
    templateName: 'footer',
    tagName: 'footer',
    contentBinding: 'controller.indexer.status',
    version: function() {
        return this.get('config.version') + ' (' + this.get('config.currentRevision') + ')';
    }.property('config.currentRevision', 'config.version')
});
