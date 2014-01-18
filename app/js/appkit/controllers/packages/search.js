import BaseControllerMixin from 'mixins/baseControllerMixin';
import PaginationSupport from 'mixins/paginationSupport';
import ProgressIndicator from 'progressIndicator';

export default Ember.ObjectController.extend(BaseControllerMixin, PaginationSupport, {
    totalBinding: Ember.Binding.oneWay('model.totalHits'),
    pageBinding: 'model.page',
    sort: 'score',

    isEmptyQuery: function() {
        return Ember.isEmpty(this.get('query'));
    }.property('query'),

    goTo: function(query) {
        if (Ember.isEmpty(query)) {
            this.transitionToRoute('packages.list');
            return;
        }

        var model = this._search(query);
        this.transitionToRoute('packages.search', model);
    },

    update: function(query, page) {
        var model = this._search(query, page);
        var self = this;

        model.then(function() {
            self.set('model', model);
        });
    },

    _search: function(query, page) {
        page = page || 0;
        var completed = false;

        setTimeout(function() {
            if (!completed) {
                ProgressIndicator.start();
            }
        }, 250);

        return App.packages.search(query, page, this.get('pageSize'), this.get('sort'))
            .then(function(model) {
                completed = true;
                ProgressIndicator.done();
                return model;
            });
    },

    actions: {
        'nextPage': function() {
            this.update(this.get('query'), this.get('page') + 1);
        },
        'previousPage': function () {
            this.update(this.get('query'), this.get('page') - 1);
        },
        'goTo': function () {
            this.goTo.apply(this, arguments);
        },
    },
});
