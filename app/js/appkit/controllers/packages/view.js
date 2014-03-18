import BaseControllerMixin from 'mixins/baseControllerMixin';
import PaginationSupport from 'mixins/paginationSupport';

export default Ember.ObjectController.extend(BaseControllerMixin, {
    installCommand: function() {
        return 'Install-Package ' + this.get('model.id')
            + ' -Version ' + this.get('model.version')
            + ' -Source ' + this.get('packageSourceUri');
    }.property('model.id', 'model.version', 'packageSourceUri'),

    installCommandWithPrompt: function() {
        return 'PM> ' + this.get('installCommand');
    }.property('installCommand'),

    sortColumn: 'version',
    sortAscending: true,

    actions: {
        sortVersions: function(column) {
            var arr = this.get('model.versionHistory');
            var prevSortColumn = this.get('sortColumn');

            arr = arr.sortBy(column);

            if (prevSortColumn === column && this.get('sortAscending')) {
                arr = arr.reverse();
                this.set('sortAscending', false);
            } else {
                this.set('sortAscending', true);
            }

            this.set('sortColumn', column);
            this.set('model.versionHistory', arr);
        }
    }
});
