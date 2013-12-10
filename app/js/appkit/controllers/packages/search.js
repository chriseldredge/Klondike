import BaseControllerMixin from 'mixins/baseControllerMixin';
import PaginationSupport from 'mixins/paginationSupport';

export default Ember.ObjectController.extend(BaseControllerMixin, PaginationSupport, {
    totalBinding: Ember.Binding.oneWay('model.totalHits'),

    didRequestPage: function () {
        // when a new search is being loaded, ignore when the page gets set back to zero.
        if (this.get('loading')) return;

        var model = App.packages.search(this.get('query'), this.get('page'), this.get('pageSize'));
        this.set('model', model);
    },

    goTo: function(query) {
        var model = App.packages.search(query, 0, this.get('pageSize'));
        this.transitionToRoute('packages.search', model);
    },

    actions: {
        'nextPage': function() {
            this.nextPage.apply(this, arguments);
        },
        'previousPage': function () {
            this.previousPage.apply(this, arguments);
        },
        'goTo': function () {
            this.goTo.apply(this, arguments);
        },
    },
});
    
//TODO:    app.PackagesViewController = em.ObjectController.extend(app.BaseControllerMixin);
