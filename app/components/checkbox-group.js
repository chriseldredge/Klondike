import Ember from 'ember';

export default Ember.View.extend({
    tagName: 'ul',
    classNames: ['ember-checkbox-group'],
    name: null,
    selection: null,
    content: null,
    checkboxLabelPath: 'content',
    checkboxValuePath: 'content'
});
