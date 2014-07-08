import BaseControllerMixin from 'mixins/baseControllerMixin';
import PaginationSupport from 'mixins/paginationSupport';
import ProgressIndicator from 'progressIndicator';

export default Ember.ObjectController.extend(BaseControllerMixin, PaginationSupport, {
    queryParams: ['query', 'page', 'sortBy'],

    totalBinding: Ember.Binding.oneWay('model.totalHits'),
    pageBinding: 'model.page',
    sortBy: 'score',
    query: '',

    isEmptyQuery: function() {
        return Ember.isEmpty(this.get('query'));
    }.property('query'),

    actions: {
        'nextPage': function() {
            this.set('page', this.get('page') + 1);
        },
        'previousPage': function () {
            this.set('page', this.get('page') - 1);
        },
    },
});
