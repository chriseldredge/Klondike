import Ember from 'ember';

export default Ember.View.extend({
  injectMarkup: function() {
    var content = Ember.$('#index-content').clone();

    var source = Ember.$(this.$().children()[0]).clone();
    content.find('#package-source-placeholder').replaceWith(source);

    var command = Ember.$(this.$().children()[1]).clone();
    content.find('#package-source-command-placeholder').replaceWith(command);

    this.$().empty();
    content.appendTo(this.$());
  }.on('didInsertElement')
});
