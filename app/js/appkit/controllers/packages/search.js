import BaseControllerMixin from 'mixins/baseControllerMixin';
import PaginationSupport from 'mixins/paginationSupport';
import ProgressIndicator from 'progressIndicator';

export default Ember.ObjectController.extend(BaseControllerMixin, PaginationSupport, {
    totalBinding: Ember.Binding.oneWay('model.totalHits'),

    goTo: function(query, page) {
        page = page || 0;

        ProgressIndicator.start();
        var model = App.packages.search(query, page, this.get('pageSize'));
        this.transitionToRoute('packages.search', model);
        model.then(function() {
            ProgressIndicator.done();
        })
    },

    actions: {
        'nextPage': function() {
            this.goTo(this.get('query'), this.get('page') + 1);
        },
        'previousPage': function () {
            this.goTo(this.get('query'), this.get('page') - 1);
        },
        'goTo': function () {
            this.goTo.apply(this, arguments);
        },
    },
});
