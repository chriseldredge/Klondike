import Ember from 'ember';
import config from '../config/environment';

export default Ember.View.extend({
    config: config,
    templateName: 'footer',
    tagName: 'footer',
    contentBinding: 'controller.indexer.status',
    versionBinding: 'application.version'
});
