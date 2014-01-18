export default Ember.TextField.extend({
    becomeFocused: function() {
        this.$().focus();
    }.on('didInsertElement')
});
