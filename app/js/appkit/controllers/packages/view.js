import BaseControllerMixin from 'mixins/baseControllerMixin';
import PaginationSupport from 'mixins/paginationSupport';

export default Ember.ObjectController.extend(BaseControllerMixin, {

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
