import Ember from 'ember';

export default Ember.View.extend({
  injectMarkup: function() {
    var content = Ember.$('#index-content').clone();

    var source = Ember.$(this.$().children()[0]);
    var command = Ember.$(this.$().children()[1]);

    content.find('#package-source-placeholder').replaceWith(source);
    content.find('#package-source-command-placeholder').replaceWith(command);

    this.$().empty();
    content.appendTo(this.$());
  }.on('didInsertElement')
});
