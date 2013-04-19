define(['ember', 'models/paginationSupport'], function (em, paginationSupport) {
    return em.ObjectController.extend(paginationSupport, {
        totalBinding: em.Binding.oneWay('model.totalHits'),
        pageBinding: em.Binding.oneWay('model.page'),
        
        goTo: function (query) {
            var model = App.Packages.search(query, 0, this.get('pageSize'));
            this.transitionToRoute('search', model);
        },
        
        didRequestPage: function () {
            // when a new search is being loaded, ignore when the page gets set back to zero.
            if (this.get('loading')) return;

            var model = App.Packages.search(this.get('query'), this.get('page'), this.get('pageSize'));
            this.set('model', model);
        }
    });
});