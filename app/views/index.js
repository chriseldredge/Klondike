import Ember from 'ember';
import config from '../config/environment';

export default Ember.View.extend({
  injectMarkup: function() {
    console.log(command);
    var content = Ember.$('#index-content').clone();

    var source = $(this.$().children()[0]).clone();
    content.find('#package-source-placeholder').replaceWith(source);

    var command = $(this.$().children()[1]).clone();
    content.find('#package-source-command-placeholder').replaceWith(command);

    this.$().replaceWith(content);
  }.on('didInsertElement')
});
