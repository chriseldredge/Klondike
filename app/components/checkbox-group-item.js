import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'li',
    selectionBinding: 'parentView.selection',

    checked: function () {
        return this.get('selection').contains(this.get('value'));
    }.property('selection', 'value'),

    init: function() {
        this.on('change', this._updateSelection);
        this.labelPathDidChange();
        this.valuePathDidChange();

        return this._super();
    },

    labelPathDidChange: Ember.observer('parentView.checkboxLabelPath', function () {
        var labelPath = this.get('parentView.checkboxLabelPath');

        if (!labelPath) { return; }

        Ember.defineProperty(this, 'label', function () {
            return this.get(labelPath);
        }.property(labelPath));
    }),

    valuePathDidChange: Ember.observer('parentView.checkboxValuePath', function () {
        var labelPath = this.get('parentView.checkboxValuePath');

        if (!labelPath) { return; }

        Ember.defineProperty(this, 'value', function () {
            return this.get(labelPath);
        }.property(labelPath));
    }),

    _updateSelection: function (e) {
        var val = this.get('value');
        if (e.target.checked) {
            this.get('selection').pushObject(val);
        } else {
            this.get('selection').removeObject(val);
        }
    }
});
