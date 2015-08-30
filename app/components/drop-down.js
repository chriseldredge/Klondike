import Ember from "ember";

export default Ember.Component.extend({
  tagName: 'select',
  content: [],
  selectedValue: null,

  didInsertElement: function() {
    const self = this;
    const $select = this.$(this.element);
    $select.on('change', function() {
      const selectedIndex = $select.prop('selectedIndex');
      const content = self.get('content');
      const selectedItem = content[selectedIndex];

      self.set('selectedValue', selectedItem.value);
    });
  }
});
