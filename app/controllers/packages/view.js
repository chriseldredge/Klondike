import Ember from 'ember';
import BaseControllerMixin from 'klondike/mixins/base-controller';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    installCommand: function() {
        return 'Install-Package ' + this.get('model.id') +
            ' -Version ' + this.get('model.version') +
            ' -Source ' + this.get('packageSourceUri');
    }.property('model.id', 'model.version', 'packageSourceUri'),

    installCommandWithPrompt: function() {
        return 'PM> ' + this.get('installCommand');
    }.property('installCommand'),

    sortColumn: 'semanticVersion',

    actions: {
        sortVersions: function(column) {
            var arr = this.get('model.versionHistory');
            var prevSortColumn = this.get('sortColumn');

            if (prevSortColumn === column) {
                arr = arr.copy().reverse();
            } else {
                arr = arr.sortBy(column).reverse();
                this.set('sortColumn', column);
            }

            this.set('model.versionHistory', arr);
        }
    }
});
