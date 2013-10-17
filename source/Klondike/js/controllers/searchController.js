define(['ember', 'models/paginationSupport'], function (em, paginationSupport) {
    return em.ObjectController.extend(paginationSupport, {
        totalBinding: em.Binding.oneWay('model.totalHits'),

        didRequestPage: function () {
            // when a new search is being loaded, ignore when the page gets set back to zero.
            if (this.get('loading')) return;

            var model = App.Packages.search(this.get('query'), this.get('page'), this.get('pageSize'));
            this.set('model', model);
        },

        goTo: function(query) {
            var model = App.Packages.search(query, 0, this.get('pageSize'));
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
});