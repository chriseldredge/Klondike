export default Ember.View.extend({
    defaultTemplate: Ember.Handlebars.compile('{{#each view.content}}{{view view.listItemView content=this}}{{/each}}'),
    tagName: 'ul',
    classNames: ['ember-checkbox-group'],
    name: null,
    selection: null,
    content: null,
    checkboxLabelPath: 'content',
    checkboxValuePath: 'content',
    
    listItemView: Ember.View.extend({
        tagName: 'li',
        template: Ember.Handlebars.compile('<label>{{input type="checkbox" name=name value=view.value checked=view.checked}} {{view.label}}</label>'),

        selectionBinding: 'parentView.selection',
        
        checked: function () {
            return this.get('selection').contains(this.get('value'));
        }.property('selection', 'value'),
        
        init: function() {
            this.on("change", this._updateSelection);
            this.labelPathDidChange();
            this.valuePathDidChange();
            
            return this._super();
        },
        
        labelPathDidChange: function () {
            var labelPath = this.get('parentView.checkboxLabelPath');

            if (!labelPath) { return; }

            Ember.defineProperty(this, 'label', function () {
                return this.get(labelPath);
            }.property(labelPath));
        }.observes('parentView.checkboxLabelPath'),

        valuePathDidChange: function () {
            var labelPath = this.get('parentView.checkboxValuePath');

            if (!labelPath) { return; }

            Ember.defineProperty(this, 'value', function () {
                return this.get(labelPath);
            }.property(labelPath));
        }.observes('parentView.checkboxValuePath'),

        _updateSelection: function (e) {
            var val = this.get('value');
            if (e.target.checked) {
                this.get('selection').pushObject(val);
            } else {
                this.get('selection').removeObject(val);
            }
        }
    })
});
